import numpy as np

def get_embedding_model(model_name="default"):
    """
    Returns a function that can generate embeddings for text
    
    Args:
        model_name (str): Name of the embedding model to use
            - "default": Simple random vector generator (for demo purposes)
            - "sentence-transformers": Mocked sentence-transformers model
            - "openai": Mocked OpenAI embeddings API
    
    Returns:
        function: A function that takes text and returns embedding vector
    """
    if model_name == "default":
        # Simple random embeddings (for demonstration)
        def default_embedder(text):
            # Generate a deterministic but random-looking embedding based on the text
            np.random.seed(hash(text) % 2**32)
            embedding = np.random.rand(384)
            np.random.seed(None)  # Reset seed
            return embedding
        return default_embedder
        
    elif model_name == "sentence-transformers":
        # Mock sentence-transformers model
        def sentence_transformer_embedder(text):
            # In a real implementation, you would use:
            # from sentence_transformers import SentenceTransformer
            # model = SentenceTransformer('all-MiniLM-L6-v2')
            # embedding = model.encode(text)
            
            # For demo, generate a deterministic embedding
            np.random.seed(hash(text) % 2**32)
            embedding = np.random.rand(384)  # 384 is typical for many sentence-transformers models
            np.random.seed(None)
            return embedding
        return sentence_transformer_embedder
        
    elif model_name == "openai":
        # Mock OpenAI embeddings
        def openai_embedder(text):
            # In a real implementation, you would use:
            # import openai
            # openai.api_key = "your-api-key"
            # response = openai.Embedding.create(input=text, model="text-embedding-ada-002")
            # embedding = response["data"][0]["embedding"]
            
            # For demo, generate a deterministic embedding
            np.random.seed(hash(text) % 2**32)
            embedding = np.random.rand(1536)  # 1536 is typical for OpenAI text-embedding-ada-002
            np.random.seed(None)
            return embedding
        return openai_embedder
        
    else:
        raise ValueError(f"Unknown model: {model_name}")

# Example usage:
# embedder = get_embedding_model("sentence-transformers")
# embedding = embedder("This is an example text")

# Example models and their dimensions
embedding_models = {
    "default": 384,
    "sentence-transformers:all-MiniLM-L6-v2": 384,
    "sentence-transformers:all-mpnet-base-v2": 768, 
    "openai:text-embedding-ada-002": 1536,
    "openai:text-embedding-3-small": 1536,
    "openai:text-embedding-3-large": 3072,
}

def get_available_models():
    """Returns a list of available embedding models"""
    return list(embedding_models.keys())

def get_model_dimension(model_name):
    """Returns the dimension of the specified model"""
    if model_name in embedding_models:
        return embedding_models[model_name]
    else:
        # Default to 384 if unknown
        return 384
