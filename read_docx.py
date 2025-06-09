import sys
from docx import Document

def read_docx(file_path):
    doc = Document(file_path)
    for para in doc.paragraphs:
        print(para.text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python read_docx.py <file_path>")
    else:
        read_docx(sys.argv[1])
