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
  const [loading, setLoading] = useState(false);

  const hasImages = imageUrls.some(url => url !== '');

  const handleGenerate = async () => {
    try{
        setLoading(true); // ローディング開始
        const imageResponse = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: `Create an image of a new vegetable that combines the characteristics of a ${inputTextA} and a ${inputTextB}. 
        It feels so close to the real thing.
        The image should have a transparent background.
        One piece.
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
    } catch (error) {
        console.error('Error generating images:', error);
    } finally {
        setLoading(false); // ローディング終了
    }
  };
  const handleBulkDownload = async () => {
    const zip = new JSZip();

    // 画像を一つずつZIPに追加
    imageUrls.forEach((url, index) => {
      if (url) {
        const filename = `generated_image_${index + 1}.png`;
        zip.file(filename, fetch(url).then(res => res.blob()));
      }
    });

    // ZIPファイルを生成してダウンロード
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'images.zip');
    });
  };

  return (
    <div>
      <h1>新しい野菜のイメージを生成AIで作ってみよう</h1>
      <div className='flex-container'>
        <div>
            <h2 className='vegetable'>野菜A</h2>
            <input
                type="text"
                size="30"
                value={inputTextA}
                onChange={(e) => setInputTextA(e.target.value)}
                placeholder="Enter text like 'cucumber'"
            />
        </div>
        <div>
            <h1>➕</h1>
        </div>
        <div>
            <h2 className='vegetable'>野菜B</h2>
            <input
                type="text"
                size="30"
                value={inputTextB}
                onChange={(e) => setInputTextB(e.target.value)}
                placeholder="Enter text like 'carrot'"
            />
        </div>
      </div>
      <div>
        <h2>特徴は？（例えば、「病気に強い」「収穫量が多い」...）</h2>
      </div>
      <div>
        <div className='feature-input-container'>
            <h3>特徴1　:　</h3>
            <input
                type="text"
                size="50"
                value={inputFeature1}
                onChange={(e) => setInputFeature1(e.target.value)}
                placeholder="Enter text like 'disease-resistant varieties'"
            />
        </div>
        <div className='feature-input-container'>
            <h3>特徴2　:　</h3>
            <input
                type="text"
                size="50"
                value={inputFeature2}
                onChange={(e) => setInputFeature2(e.target.value)}
                placeholder="Enter text like 'disease-resistant varieties'"
            />
        </div>
        <div className='feature-input-container'>
            <h3>特徴3　:　</h3>
            <input
                type="text"
                size="50"
                value={inputFeature3}
                onChange={(e) => setInputFeature3(e.target.value)}
                placeholder="Enter text like 'disease-resistant varieties'"
            />
        </div>
      </div>
        <button onClick={handleGenerate} disabled={loading}>
            {loading ? '生成中です...' : '生成する'}
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
        {imageUrls.map((imageUrl, index) => (
        imageUrl && <img key={index} src={imageUrl} alt={`Generated ${index}`} style={{ maxWidth: '100px', height: 'auto' }} />
      ))}
        </div>
        <div>
            {hasImages && (
                <button onClick={handleBulkDownload}>
                    すべてダウンロード
                </button>
            )}
        </div>
    </div>
  );
}

export default ImageGenApp;