import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function ImageGenApp() {
  const [inputTextA, setInputTextA] = useState('');
  const [inputTextB, setInputTextB] = useState('');

  const [inputFeature1, setInputFeature1] = useState('');
  const [inputFeature2, setInputFeature2] = useState('');
  const [inputFeature3, setInputFeature3] = useState('');

  const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);
//   const [imageUrls, setImageUrls] = useState(['']);
  const [loading, setLoading] = useState(false);

  const hasImages = imageUrls.some(url => url !== '');

  const handleGenerate = async () => {
    try{
        setLoading(true); // ローディング開始
        const imageResponse = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: `Create an image of a new vegetable that combines the characteristics of a ${inputTextA} and a ${inputTextB}. 
        It feels so close to the real thing.
        The image should have a transparent background.
        Please only include one vegetable in the image.
        The new vegetable should have the following characteristics:
        1. ${inputFeature1}
        2. ${inputFeature2}
        3. ${inputFeature3}
        `,
        n: 5,
        size: '256x256',
        }, {
        headers: {
            'Authorization': process.env.REACT_APP_CHATGPT_API_KEY,
            'Content-Type': 'application/json',
        }
        });
    
        const newUrls = [...imageUrls]; // 既存の配列をコピー
        for (let i = 0; i < newUrls.length; i++) {
            newUrls[i] = imageResponse.data.data[i].url; // 各要素に新しい値を代入
        }
        setImageUrls(newUrls); // 状態を更新

        console.log('成功');
        console.log(newUrls);
    } catch (error) {
        console.error('Error generating images:', error);
    } finally {
        setLoading(false); // ローディング終了
    }
  };
    const handleDownloadZip = async () => {
        const zip = new JSZip();
        const imgFolder = zip.folder('images');

        try {
        // Fetch and add each image to the ZIP
        await Promise.all(imageUrls.map(async (url, index) => {
            if (url) {
            const response = await axios.get(`http://localhost:5000/image-proxy?imageUrl=${encodeURIComponent(url)}`, {
                responseType: 'arraybuffer',
            });
            imgFolder.file(`image-${index}.png`, response.data);
            }
        }));

        // Generate and download the ZIP file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'images.zip');
        } catch (error) {
        console.error('Error downloading images as ZIP', error);
        }
    };

  return (
    <div>
      <h1>新しい野菜のイメージを生成AIで作ってみよう</h1>
      <div>
        <h2>1. 好きな野菜を２つ入力しよう</h2>
      </div>
      <div className='flex-container'>
        <div className='input-vegetable'>
            <h2 className='vegetable'>野菜 A 🍅</h2>
            <input
                type="text"
                size="30"
                value={inputTextA}
                onChange={(e) => setInputTextA(e.target.value)}
                placeholder="　例）トマト"
                className='input-text'
            />
        </div>
        <div>
            <h1>➕</h1>
        </div>
        <div className='input-vegetable'>
            <h2 className='vegetable'>野菜 B 🍆</h2>
            <input
                type="text"
                size="30"
                value={inputTextB}
                onChange={(e) => setInputTextB(e.target.value)}
                placeholder="　例）なす"
                className='input-text'
            />
        </div>
      </div>
      <div className='head-2'>
        <h2>2. 特徴は？（例えば、「病気に強い」「収穫量が多い」...）</h2>
      </div>
      <div>
        <div className='feature-input-container'>
            <h2>特徴１　:　</h2>
            <input
                type="text"
                size="55"
                value={inputFeature1}
                onChange={(e) => setInputFeature1(e.target.value)}
                placeholder="　Enter text like 'disease-resistant varieties'"
                className='input-text'
            />
        </div>
        <div className='feature-input-container'>
            <h2>特徴２　:　</h2>
            <input
                type="text"
                size="55"
                value={inputFeature2}
                onChange={(e) => setInputFeature2(e.target.value)}
                placeholder="　Enter text like 'disease-resistant varieties'"
                className='input-text'
            />
        </div>
        <div className='feature-input-container'>
            <h2>特徴３　:　</h2>
            <input
                type="text"
                size="55"
                value={inputFeature3}
                onChange={(e) => setInputFeature3(e.target.value)}
                placeholder="　Enter text like 'disease-resistant varieties'"
                className='input-text'
            />
        </div>
      </div>
        <button onClick={handleGenerate} disabled={loading} className='btn_19'>
            {loading ? '生成中です...' : '生成する'}
        </button>

        <div className='images-container'>
        {imageUrls.map((imageUrl, index) => (
            imageUrl && <img key={index} src={imageUrl} alt={`Generated ${index}`} style={{ maxWidth: '100px', height: 'auto' }} />
        ))}
        </div>
        <div>
            {hasImages && (
                <button onClick={handleDownloadZip} className='btn_19'>
                    すべてダウンロード
                </button>
            )}
        </div>
        <footer className='footer'>
          <p>© 2024 久留米工業大学 AI応用研究所</p>
        </footer>
    </div>
  );
}

export default ImageGenApp;