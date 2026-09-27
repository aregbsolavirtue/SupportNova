"""
Step 5 of your task: Document Parsing.

Extracts text from PDF/DOCX while keeping track of WHERE each piece of
text came from (page number, heading). This traceability is what lets
the app later say "this resolution step comes from Policy X, Section
5.2" instead of just "the AI said so" - which is a core requirement
across the whole SRS (source-grounding / traceability).
"""

from dataclasses import dataclass
from typing import Optional
import fitz  # PyMuPDF
import docx  # python-docx


@dataclass
class ParsedBlock:
    """One piece of extracted text with its location metadata."""
    text: str
    page_number: Optional[int] = None
    heading: Optional[str] = None


def parse_pdf(filepath: str) -> list[ParsedBlock]:
    blocks = []
    with fitz.open(filepath) as pdf:
        for page_num, page in enumerate(pdf, start=1):
            text = page.get_text("text").strip()
            if text:
                blocks.append(ParsedBlock(text=text, page_number=page_num))
    return blocks


def parse_docx(filepath: str) -> list[ParsedBlock]:
    """
    DOCX has no fixed 'pages', so instead we track headings.
    Any paragraph styled as a heading becomes the section label
    for the text that follows it, until the next heading.
    """
    document = docx.Document(filepath)
    blocks = []
    current_heading = None
    current_text_parts = []

    def flush():
        if current_text_parts:
            blocks.append(ParsedBlock(
                text="\n".join(current_text_parts).strip(),
                heading=current_heading,
            ))

    for para in document.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        if para.style.name.startswith("Heading"):
            flush()
            current_heading = text
            current_text_parts = []
        else:
            current_text_parts.append(text)

    flush()  # capture the last section
    return blocks


def parse_document(filepath: str) -> list[ParsedBlock]:
    """Dispatch by extension - the single entry point the rest of your
    module should call."""
    if filepath.lower().endswith(".pdf"):
        return parse_pdf(filepath)
    elif filepath.lower().endswith(".docx"):
        return parse_docx(filepath)
    else:
        raise ValueError(f"Unsupported file type: {filepath}")
