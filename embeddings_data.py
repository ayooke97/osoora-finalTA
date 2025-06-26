import numpy as np

# Define large embedding arrays for the data in confusion_matrix.py
# Using 384-dimensional embeddings (common size for efficient embedding models)

# Embeddings for formal texts
formal_embeddings = {
    "Apakah kepemilikan tanah wajib disertai dengan kesesuaian alamat pada Kartu Tanda Penduduk (KTP) pemilik?": 
        np.random.rand(384),
    "Bagaimana prosedur perubahan data kependudukan pada KTP apabila seseorang telah berpindah domisili akibat jual beli tanah?": 
        np.random.rand(384),
    "Apakah seseorang yang berdomisili di luar daerah masih dapat memiliki hak atas tanah di daerah lain secara hukum?": 
        np.random.rand(384),
    "Dalam hal warisan tanah, apakah keabsahan KTP ahli waris menjadi dasar yang sah untuk pengurusan sertifikat?": 
        np.random.rand(384),
}

# Embeddings for semi-formal texts
semi_formal_embeddings = {
    "Kalau punya tanah di daerah lain tapi KTP-nya masih alamat lama, bakal jadi masalah nggak buat ngurus sertifikat?": 
        np.random.rand(384),
    "Apa pentingnya sinkronisasi data KTP dengan data tanah di BPN?": 
        np.random.rand(384),
    "KTP saya beda domisili sama tanah yang saya beli, kira-kira apa konsekuensinya?": 
        np.random.rand(384),
    "Untuk balik nama sertifikat tanah, KTP pemilik lama harus masih aktif atau nggak masalah kalau sudah pindah?": 
        np.random.rand(384),
}

# Embeddings for informal texts
informal_embeddings = {
    "Bang, KTP gua masih Jakarta, tapi tanahnya di Bekasi, bisa gua balik nama gak?": 
        np.random.rand(384),
    "Eh kalo gue mau jual tanah, tapi KTP udah beda alamat, ribet gak sih?": 
        np.random.rand(384),
    "Gue punya tanah warisan, tapi KTP gue beda kota. Bisa gue urus gak tuh?": 
        np.random.rand(384),
    "Kalau KTP ilang, tanah bisa diambil orang gak sih?": 
        np.random.rand(384),
    "Bro, KTP lo masih Depok, tapi lo ngincer tanah di Bali. Legal gak sih?": 
        np.random.rand(384),
    "Ngurus tanah tapi KTP nyokap udah expired, ini red flag gak?": 
        np.random.rand(384),
    "Gue udah FOMO beli tanah virtual, tapi KTP gue belum e-KTP. Wkwk ada yang relate?": 
        np.random.rand(384),
    "Sertifikat tanah warisan vs KTP beda generasi: siapa yang menang?": 
        np.random.rand(384),
    "KTP saya sudah tua dan buram, tapi tanah saya belum bersertifikat. Masih bisa saya urus sendiri?": 
        np.random.rand(384),
    "Kalau saya ingin mewariskan tanah ke anak, apakah KTP saya harus masih berlaku?": 
        np.random.rand(384),
    "Saya kerja di luar negeri dan KTP Indonesia saya belum diperpanjang. Bagaimana cara mengurus tanah warisan dari jauh?": 
        np.random.rand(384),
    "Boleh gak punya tanah di kampung halaman walau saya udah lama tinggal di luar negeri?": 
        np.random.rand(384),
}

# Consolidated embeddings dictionary with all prompts
all_embeddings = {**formal_embeddings, **semi_formal_embeddings, **informal_embeddings}

# Create array versions (useful for some ML tasks)
formal_embeddings_array = np.array(list(formal_embeddings.values()))
semi_formal_embeddings_array = np.array(list(semi_formal_embeddings.values()))
informal_embeddings_array = np.array(list(informal_embeddings.values()))

# Combined array of all embeddings (20 examples × 384 dimensions)
all_embeddings_array = np.array(list(all_embeddings.values()))

# Higher dimension embeddings (768-dimensional like BERT base)
high_dim_embeddings = np.random.rand(len(all_embeddings), 768)

# Very large embeddings (1536-dimensional like some advanced models)
very_large_embeddings = np.random.rand(len(all_embeddings), 1536)

# Function to get embedding for a specific prompt
def get_embedding_for_prompt(prompt):
    """Get the embedding vector for a specific prompt"""
    if prompt in all_embeddings:
        return all_embeddings[prompt]
    else:
        # Return zeros if prompt not found
        return np.zeros(384)

# Function to get all embeddings for a specific style
def get_embeddings_by_style(style):
    """Get all embeddings for a specific typing style"""
    if style == 'formal':
        return formal_embeddings_array
    elif style == 'semi-formal':
        return semi_formal_embeddings_array
    elif style == 'informal':
        return informal_embeddings_array
    else:
        raise ValueError(f"Unknown style: {style}")

# Example usage in confusion_matrix context:
# 
# from embeddings_data import get_embedding_for_prompt
#
# # In your evaluate_classification function or elsewhere:
# for prompt, true, pred in zip(prompts, y_true, y_pred):
#     embedding = get_embedding_for_prompt(prompt)
#     # Use embedding for visualization, clustering, etc.
