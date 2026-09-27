"""
Step 6 of your task: Document Chunking.

Turns the parsed blocks (one per page or heading) into smaller,
retrievable chunks. Why chunk at all instead of storing whole pages?
- Embedding models work best on focused, medium-length text
- Retrieval is more precise when a chunk covers one idea, not a
  whole multi-topic page
- It keeps context small when you send retrieved text to the GenAI API
"""

from knowledge_base.models import Chunk, PolicyStatus
from document_processing.parser import ParsedBlock

CHUNK_SIZE_CHARS = 800          # roughly 150-200 words per chunk
CHUNK_OVERLAP_CHARS = 100       # small overlap so we don't cut a sentence's
                                 # meaning in half between two chunks


def chunk_blocks(
    blocks: list[ParsedBlock],
    document_id: str,
    version: str,
    status: PolicyStatus,
) -> list[Chunk]:
    chunks: list[Chunk] = []
    counter = 1

    for block in blocks:
        text = block.text
        start = 0
        while start < len(text):
            end = start + CHUNK_SIZE_CHARS
            piece = text[start:end].strip()
            if piece:
                chunks.append(Chunk(
                    chunk_id=f"{document_id}-c{counter:04d}",
                    document_id=document_id,
                    heading=block.heading,
                    page_number=block.page_number,
                    version=version,
                    status=status,
                    text=piece,
                ))
                counter += 1
            start = end - CHUNK_OVERLAP_CHARS  # step forward with overlap

    return chunks
