import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.cluster import KMeans
from embedding_models import get_embedding_model
from embeddings_data import all_embeddings, all_embeddings_array
import pandas as pd


def visualize_embeddings(embeddings_array, labels, title="Embedding Visualization", method="pca"):
    """
    Visualize high-dimensional embeddings in 2D using PCA or t-SNE
    
    Args:
        embeddings_array: numpy array of shape (n_samples, n_dimensions)
        labels: list of corresponding labels for each embedding
        title: plot title
        method: 'pca' or 'tsne'
    """
    # Convert to numpy array if not already
    embeddings_array = np.array(embeddings_array)
    
    # Reduce dimensions to 2D
    if method.lower() == "pca":
        reducer = PCA(n_components=2)
    else:  # t-SNE
        reducer = TSNE(n_components=2, random_state=42, perplexity=min(len(embeddings_array)-1, 30))
        
    reduced_embeddings = reducer.fit_transform(embeddings_array)
    
    # Create a scatter plot
    plt.figure(figsize=(12, 8))
    
    # Get unique labels and assign colors
    unique_labels = np.unique(labels)
    colors = plt.cm.rainbow(np.linspace(0, 1, len(unique_labels)))
    
    for i, label in enumerate(unique_labels):
        mask = [l == label for l in labels]
        plt.scatter(
            reduced_embeddings[mask, 0],
            reduced_embeddings[mask, 1],
            label=label,
            color=colors[i],
            alpha=0.7
        )
    
    plt.title(title)
    plt.xlabel(f"{method.upper()} Component 1")
    plt.ylabel(f"{method.upper()} Component 2")
    plt.legend()
    plt.grid(alpha=0.3)
    return plt


def cluster_embeddings(embeddings_array, n_clusters=3):
    """
    Cluster embeddings using KMeans
    
    Args:
        embeddings_array: numpy array of shape (n_samples, n_dimensions)
        n_clusters: number of clusters to form
    
    Returns:
        labels: cluster labels for each embedding
    """
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    return kmeans.fit_predict(embeddings_array)


def get_embedding_statistics(embeddings_dict):
    """
    Calculate statistics for embeddings
    
    Args:
        embeddings_dict: dictionary mapping text to embedding vectors
    
    Returns:
        DataFrame with embedding statistics
    """
    stats = {
        "text": [],
        "embedding_dim": [],
        "mean": [],
        "std": [],
        "min": [],
        "max": [],
        "norm": []
    }
    
    for text, embedding in embeddings_dict.items():
        stats["text"].append(text[:50] + "..." if len(text) > 50 else text)
        stats["embedding_dim"].append(embedding.shape[0])
        stats["mean"].append(embedding.mean())
        stats["std"].append(embedding.std())
        stats["min"].append(embedding.min())
        stats["max"].append(embedding.max())
        stats["norm"].append(np.linalg.norm(embedding))
    
    return pd.DataFrame(stats)


def analyze_embeddings_by_style(data):
    """
    Analyze embeddings grouped by typing style
    
    Args:
        data: list of (prompt, style, true_label, pred_label) tuples
    
    Returns:
        Dictionary with analysis results
    """
    # Import necessary modules
    from embeddings_data import get_embedding_for_prompt
    from collections import defaultdict
    
    # Group data by style
    style_groups = defaultdict(list)
    style_embeddings = defaultdict(list)
    style_labels = defaultdict(list)
    
    for prompt, style, true_label, pred_label in data:
        embedding = get_embedding_for_prompt(prompt)
        style_groups[style].append((prompt, embedding, true_label, pred_label))
        style_embeddings[style].append(embedding)
        style_labels[style].append(true_label)
    
    results = {}
    
    # Analyze each style group
    for style, items in style_groups.items():
        embeddings_array = np.array(style_embeddings[style])
        
        # Get PCA of embeddings
        pca = PCA(n_components=min(5, len(embeddings_array)))
        pca_result = pca.fit_transform(embeddings_array)
        
        # Get cluster labels
        cluster_labels = cluster_embeddings(
            embeddings_array, 
            n_clusters=min(3, len(embeddings_array))
        )
        
        # Store results
        results[style] = {
            "count": len(items),
            "embedding_dim": embeddings_array.shape[1],
            "pca_components": pca_result,
            "explained_variance": pca.explained_variance_ratio_,
            "cluster_labels": cluster_labels,
        }
    
    return results


def cosine_similarity_matrix(embeddings_array):
    """
    Calculate cosine similarity between all pairs of embeddings
    
    Args:
        embeddings_array: numpy array of shape (n_samples, n_dimensions)
    
    Returns:
        similarity matrix of shape (n_samples, n_samples)
    """
    # Normalize embeddings
    normalized = embeddings_array / np.linalg.norm(embeddings_array, axis=1, keepdims=True)
    
    # Calculate similarity matrix
    similarity = np.dot(normalized, normalized.T)
    
    return similarity


def visualize_similarity_matrix(similarity_matrix, labels, title="Cosine Similarity Matrix"):
    """
    Visualize similarity matrix as a heatmap
    
    Args:
        similarity_matrix: square matrix of similarities
        labels: labels for each row/column
        title: plot title
    """
    plt.figure(figsize=(12, 10))
    plt.imshow(similarity_matrix, cmap='viridis')
    plt.colorbar(label='Cosine Similarity')
    
    # If there are not too many labels, show them
    if len(labels) <= 20:
        plt.xticks(range(len(labels)), labels, rotation=90)
        plt.yticks(range(len(labels)), labels)
    
    plt.title(title)
    return plt


# Usage example with your confusion matrix data
if __name__ == "__main__":
    # Import the data from confusion_matrix.py
    from confusion_matrix import data
    
    # Extract prompts, styles, true_labels and predicted_labels
    prompts = [item[0] for item in data]
    styles = [item[1] for item in data]
    true_labels = [item[2] for item in data]
    pred_labels = [item[3] for item in data]
    
    # Get embeddings for each prompt
    from embeddings_data import get_embedding_for_prompt
    embeddings = [get_embedding_for_prompt(prompt) for prompt in prompts]
    embeddings_array = np.array(embeddings)
    
    # Visualize embeddings using PCA
    plt_pca = visualize_embeddings(embeddings_array, styles, 
                                  title="Embeddings by Style (PCA)", method="pca")
    plt_pca.savefig("embeddings_by_style_pca.png")
    
    # Visualize embeddings using t-SNE
    plt_tsne = visualize_embeddings(embeddings_array, styles, 
                                   title="Embeddings by Style (t-SNE)", method="tsne")
    plt_tsne.savefig("embeddings_by_style_tsne.png")
    
    # Calculate and visualize similarity matrix
    sim_matrix = cosine_similarity_matrix(embeddings_array)
    plt_sim = visualize_similarity_matrix(sim_matrix, [p[:20] + "..." for p in prompts], 
                                         title="Prompt Similarity Matrix")
    plt_sim.savefig("prompt_similarity_matrix.png")
    
    # Get embedding statistics
    from embeddings_data import all_embeddings
    stats_df = get_embedding_statistics(all_embeddings)
    stats_df.to_csv("embedding_statistics.csv", index=False)
    
    # Analyze embeddings by style
    analysis_results = analyze_embeddings_by_style(data)
    
    # Print some results
    print("Embedding Analysis Summary:")
    for style, results in analysis_results.items():
        print(f"\nStyle: {style.upper()}")
        print(f"Number of examples: {results['count']}")
        print(f"Embedding dimension: {results['embedding_dim']}")
        print(f"PCA explained variance: {results['explained_variance']}")
        print(f"Number of clusters: {len(np.unique(results['cluster_labels']))}")
    
    print("\nEmbedding statistics saved to 'embedding_statistics.csv'")
    print("Visualizations saved as PNG files")
