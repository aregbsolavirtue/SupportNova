"""
Step: 'Find the right policy for each complaint' (semantic retrieval).

This uses ChromaDB, which is simpler to set up than FAISS for a
5-day competition timeline (it handles embedding storage AND search
in one library, whereas FAISS only does the search part and you'd
need to manage the embeddings yourself).

If you'd rather use FAISS, the concept is identical - only the
storage/search calls differ, the embedding step stays the same.
"""

import chromadb
from sentence_transformers import SentenceTransformer
from knowledge_base.models import Chunk, RetrievedChunk, PolicyStatus

# Loads a small, fast, local embedding model - no API key or cost needed.
_embedder = SentenceTransformer("all-MiniLM-L6-v2")


class VectorStore:
    def __init__(self, persist_path: str = "./chroma_data"):
        self.client = chromadb.PersistentClient(path=persist_path)
        self.collection = self.client.get_or_create_collection(
            name="policy_chunks"
        )

    def add_chunks(self, chunks: list[Chunk]) -> None:
        if not chunks:
            return
        embeddings = _embedder.encode([c.text for c in chunks]).tolist()
        self.collection.upsert(
            ids=[c.chunk_id for c in chunks],
            embeddings=embeddings,
            documents=[c.text for c in chunks],
            metadatas=[{
                "document_id": c.document_id,
                "section": c.section or "",
                "heading": c.heading or "",
                "page_number": c.page_number or -1,
                "version": c.version,
                "status": c.status.value,
            } for c in chunks],
        )

    def search(
        self,
        query_text: str,
        top_k: int = 5,
        active_only: bool = True,
    ) -> list[RetrievedChunk]:
        """
        Given complaint text (or a summary of it), returns the most
        semantically relevant policy chunks.

        active_only=True filters out draft/superseded policies at the
        DB level - never let outdated policy text reach the GenAI
        prompt as if it were current (SRS requirement: outdated
        policies must not be the basis for a final resolution).
        """
        query_embedding = _embedder.encode([query_text]).tolist()

        where_filter = {"status": PolicyStatus.ACTIVE.value} if active_only else None

        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=top_k,
            where=where_filter,
        )

        retrieved = []
        for i in range(len(results["ids"][0])):
            meta = results["metadatas"][0][i]
            chunk = Chunk(
                chunk_id=results["ids"][0][i],
                document_id=meta["document_id"],
                section=meta["section"] or None,
                heading=meta["heading"] or None,
                page_number=meta["page_number"] if meta["page_number"] != -1 else None,
                version=meta["version"],
                status=PolicyStatus(meta["status"]),
                text=results["documents"][0][i],
            )
            # Chroma returns distance; convert to a similarity-style score (0-1, higher = better)
            distance = results["distances"][0][i]
            similarity_score = 1 - distance
            retrieved.append(RetrievedChunk(chunk=chunk, similarity_score=similarity_score))

        return retrieved
