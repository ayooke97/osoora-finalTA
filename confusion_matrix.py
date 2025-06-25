# import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay, accuracy_score, precision_score, recall_score, f1_score


def evaluate_classification(y_true, y_pred, prompts=None, labels=None, average='weighted', display_labels=None):
    """
    Compute and display confusion matrix, overall accuracy, precision, recall, and F1 score.
    Also prints a table with prompt, true label, predicted label, and correctness.
    Args:
        y_true (list or array): True labels
        y_pred (list or array): Predicted labels
        prompts (list, optional): List of prompts/questions (same length as y_true/y_pred)
        labels (list, optional): List of label names (for ordering in confusion matrix)
        average (str, optional): Averaging method for multi-class metrics ('weighted', 'macro', etc.)
        display_labels (list, optional): Display labels for confusion matrix plot
    """
    # Confusion Matrix
    # cm = confusion_matrix(y_true, y_pred, labels=labels)
    # disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=display_labels or labels)
    # disp.plot(cmap=plt.cm.Blues)
    # plt.title('Confusion Matrix')
    # plt.show()

    # Metrics
    ova = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average=average, zero_division=0)
    recall = recall_score(y_true, y_pred, average=average, zero_division=0)
    f1 = f1_score(y_true, y_pred, average=average, zero_division=0)

    print(f"Overall Accuracy (OVA): {ova:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")

    # Print table of prompt, true, pred, correct
    if prompts is not None:
        print("\nDetailed Results:")
        print(f"{'Prompt':<80} {'True':<10} {'Pred':<10} {'Correct':<8}")
        print("-" * 110)
        for p, t, pr in zip(prompts, y_true, y_pred):
            correct = "Yes" if t == pr else "No"
            print(f"{str(p):<80} {str(t):<10} {str(pr):<10} {correct:<8}")

if __name__ == "__main__":
    # Sample data: (prompt, typing_style, true_label, pred_label)
    data = [
        ("Apakah kepemilikan tanah wajib disertai dengan kesesuaian alamat pada Kartu Tanda Penduduk (KTP) pemilik?", "formal", "Tidak wajib, namun kesesuaian alamat memudahkan proses administrasi dan validasi saat pengurusan hak atas tanah di kantor pertanahan.", "dog"),
        ("Bagaimana prosedur perubahan data kependudukan pada KTP apabila seseorang telah berpindah domisili akibat jual beli tanah?", "formal", "Perubahan data dilakukan melalui Dinas Kependudukan dan Catatan Sipil dengan membawa surat keterangan pindah domisili dan KTP lama.", "dog"),
        ("Apakah seseorang yang berdomisili di luar daerah masih dapat memiliki hak atas tanah di daerah lain secara hukum?", "formal", "Ya, selama warga negara Indonesia, seseorang berhak memiliki tanah di daerah mana pun di dalam wilayah Republik Indonesia.", "dog"),
        ("Dalam hal warisan tanah, apakah keabsahan KTP ahli waris menjadi dasar yang sah untuk pengurusan sertifikat?", "formal", "Ya, KTP ahli waris dibutuhkan untuk membuktikan identitas saat proses balik nama sertifikat, namun harus disertai dokumen waris yang sah.", "cat"),
        ("Kalau punya tanah di daerah lain tapi KTP-nya masih alamat lama, bakal jadi masalah nggak buat ngurus sertifikat?", "semi-formal", "Nggak masalah besar, tapi kadang diminta surat keterangan domisili atau pernyataan agar datanya tetap nyambung di BPN.", "bird"),
        ("Apa pentingnya sinkronisasi data KTP dengan data tanah di BPN?", "semi-formal", "Supaya validasi kepemilikan lebih mudah, terutama kalau mau jual-beli, waris, atau ajukan sertifikasi tanah.", "dog"),
        ("KTP saya beda domisili sama tanah yang saya beli, kira-kira apa konsekuensinya?", "semi-formal", "Biasanya nggak jadi masalah, tapi kalau ada konflik atau pengecekan lokasi, kamu bisa diminta klarifikasi tambahan.", "dog"),
        ("Untuk balik nama sertifikat tanah, KTP pemilik lama harus masih aktif atau nggak masalah kalau sudah pindah?", "semi-formal", "", "dog"),
        ("Bang, KTP gua masih Jakarta, tapi tanahnya di Bekasi, bisa gua balik nama gak?", "informal", "Bisa, Bro. KTP beda domisili bukan penghalang, asal dokumen tanah lengkap dan legal.", "dog"),
        ("Eh kalo gue mau jual tanah, tapi KTP udah beda alamat, ribet gak sih?", "informal", "Nggak ribet, tapi lo bakal disuruh bawa surat keterangan atau KTP baru buat update data.", "dog"),
        ("Gue punya tanah warisan, tapi KTP gue beda kota. Bisa gue urus gak tuh?", "informal", "Bisa banget. Bawa surat waris sama KTP aja, nanti tinggal proses ke notaris dan BPN.", "dog"),
        ("Kalau KTP ilang, tanah bisa diambil orang gak sih?", "informal", "Gak bisa dong. Tanah gak bisa diambil cuma gara-gara KTP hilang. Tapi lo harus urus KTP baru secepatnya.", "dog"),
        ("Bro, KTP lo masih Depok, tapi lo ngincer tanah di Bali. Legal gak sih?", "informal", "Legal banget. Selama lo WNI, bebas beli tanah di mana aja asal bukan tanah adat atau kawasan terbatas.", "dog"),
        ("Ngurus tanah tapi KTP nyokap udah expired, ini red flag gak?", "informal", "Kinda sus. Harus diperpanjang dulu buat urusan legal. Kalau gak, bisa kena kendala pas balik nama.", "dog"),
        ("Gue udah FOMO beli tanah virtual, tapi KTP gue belum e-KTP. Wkwk ada yang relate?", "informal", "LOL. Gak ngaruh sih buat virtual land. Tapi kalau mau ngurus legalitas IRL, better update ke e-KTP.", "dog"),
        ("Sertifikat tanah warisan vs KTP beda generasi: siapa yang menang?", "informal", "Yang menang: bukti waris dan dokumen sah. KTP cuma pelengkap identitas aja, bukan penentu utama.", "dog"),
        ("KTP saya sudah tua dan buram, tapi tanah saya belum bersertifikat. Masih bisa saya urus sendiri?", "informal", "Bisa, Pak/Bu. Tapi sebaiknya cetak ulang KTP agar mudah diverifikasi saat urus sertifikat ke BPN.", "dog"),
        ("Kalau saya ingin mewariskan tanah ke anak, apakah KTP saya harus masih berlaku?", "informal", "Ya, sebaiknya aktif supaya bisa masuk ke akta waris dan mempercepat proses balik nama.", "dog"),
        ("Saya kerja di luar negeri dan KTP Indonesia saya belum diperpanjang. Bagaimana cara mengurus tanah warisan dari jauh?", "informal", "Bisa lewat kuasa hukum atau keluarga di Indonesia. Tapi KTP tetap harus diperpanjang secara daring atau lewat KBRI.", "dog"),
        ("Boleh gak punya tanah di kampung halaman walau saya udah lama tinggal di luar negeri?", "informal", "Boleh, selama Anda masih WNI dan bisa menunjukkan bukti identitas serta legalitas pembelian atau warisan.", "dog"),

        
    ]

    from collections import defaultdict
    labels = ["cat", "dog", "bird"]

    # Group data by typing style
    groups = defaultdict(lambda: {"prompts": [], "y_true": [], "y_pred": []})
    for prompt, style, true, pred in data:
        groups[style]["prompts"].append(prompt)
        groups[style]["y_true"].append(true)
        groups[style]["y_pred"].append(pred)

    # Evaluate for each typing style
    for style, group in groups.items():
        print(f"\n=== Typing Style: {style.upper()} ===")
        evaluate_classification(
            group["y_true"],
            group["y_pred"],
            prompts=group["prompts"],
            labels=labels
        )
evaluate_classification(y_true, y_pred, labels=labels)