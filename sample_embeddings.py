import numpy as np

# Sample embeddings for demonstration
# Each row represents the embedding vector for one text sample

# 768-dimensional embeddings (common for BERT-like models)
formal_embeddings = np.random.rand(10, 768)  # 10 samples with 768 dimensions each

# 1536-dimensional embeddings (common for certain OpenAI embeddings)
semi_formal_embeddings = np.random.rand(10, 1536)  # 10 samples with 1536 dimensions each

# 384-dimensional embeddings (common for smaller models)
informal_embeddings = np.random.rand(10, 384)  # 10 samples with 384 dimensions each

# Example usage to integrate with confusion_matrix.py
def get_embeddings_by_style(style):
    """
    Returns embeddings based on typing style
    Args:
        style (str): 'formal', 'semi-formal', or 'informal'
    Returns:
        numpy.ndarray: appropriate embedding array
    """
    if style == 'formal':
        return formal_embeddings
    elif style == 'semi-formal':
        return semi_formal_embeddings
    elif style == 'informal':
        return informal_embeddings
    else:
        raise ValueError(f"Unknown style: {style}")

# Real-world example with actual embeddings
# This is how you might define them if you had pre-computed embeddings from a model

# Example embedding dictionary - maps text to embedding vector
example_text_embeddings = {
    "Apakah kepemilikan tanah wajib disertai dengan kesesuaian alamat pada Kartu Tanda Penduduk (KTP) pemilik?": 
        np.random.rand(768),  # Pretend this is the actual embedding
    
    "Bagaimana prosedur perubahan data kependudukan pada KTP apabila seseorang telah berpindah domisili akibat jual beli tanah?": 
        np.random.rand(768),
    
    # ... more embeddings for other texts
}

# How to integrate with your existing data
def add_embeddings_to_data(data):
    """
    Adds embeddings to the data structure in confusion_matrix.py
    Args:
        data (list): List of (prompt, typing_style, true_label, pred_label) tuples
    Returns:
        list: Enhanced data with embeddings as (prompt, typing_style, true_label, pred_label, embedding)
    """
    enhanced_data = []
    for prompt, style, true, pred in data:
        # In a real implementation, you would use a model to get embeddings
        # or load pre-computed embeddings
        embedding = np.random.rand(768)  # Placeholder for real embedding
        enhanced_data.append((prompt, style, true, pred, embedding))
    return enhanced_data
