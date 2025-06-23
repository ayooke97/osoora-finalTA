import sys
import os
from docx import Document
from modify_docx import apply_formatting_to_paragraph

def ensure_consistent_formatting(input_file, output_file):
    """
    Reads DOCX file, ensures consistent formatting according to standards,
    and saves to a new file
    """
    doc = Document(input_file)
    print(f"Processing {input_file}...")
    
    # Process each paragraph to ensure consistent style
    for para in doc.paragraphs:
        # Ensure proper paragraph spacing (1.5 spacing as in output_chunk.txt)
        para.paragraph_format.line_spacing = 1.5
        
        # Ensure consistent font properties
        for run in para.runs:
            if not run.font.size:
                # Default size if not specified
                run.font.size = 12 * 12700  # 12pt in docx internal units
    
    # Save the modified document
    print(f"Saving standardized document to {output_file}")
    doc.save(output_file)
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python format_fix.py input.docx output.docx")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if ensure_consistent_formatting(input_file, output_file):
        print("Formatting standardization complete!")
        print("Run read_docx.py on the new file to verify formatting matches output_chunk.txt")
