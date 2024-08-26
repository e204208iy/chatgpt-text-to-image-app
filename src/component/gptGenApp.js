import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import Tooltip from './toolTip';

function ImageGenApp() {
  const [inputTextA, setInputTextA] = useState('');
  const [inputTextB, setInputTextB] = useState('');

  const [inputFeature1, setInputFeature1] = useState('');
  const [inputFeature2, setInputFeature2] = useState('');
  const [inputFeature3, setInputFeature3] = useState('');

  const [imageUrls, setImageUrls] = useState(['', '', '', '', '','']);
  const [loading, setLoading] = useState(false);

//   const [advice, setAdvice] = useState('');
  const adviceRef = useRef('');
  const intervalIdRef = useRef(null);

  const [adviseIsLoading, setAdviseIsLoading] = useState(false);
  const [displayedAdvice, setDisplayedAdvice] = useState('');

  const debouncedTranslateA = useCallback(
    debounce(async (text) => {
      if (text) {
        try {
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: "gpt-3.5-turbo",
              messages: [
                {"role": "system", "content": "You are a translator. Translate the following Japanese text to English."},
                {"role": "user", "content": `${text}. Within 7 characters. No "." needed`}
              ]
            },
            {
              headers: {
                'Authorization': process.env.REACT_APP_CHATGPT_API_KEY,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log("英語に翻訳するAPIが発火");
          setInputTextA(response.data.choices[0].message.content.trim());
        //   setTranslatedText(response.data.choices[0].message.content.trim());
        } catch (error) {
          console.error('Translation error:', error);
        }
      } else {
        setInputTextA('');
        // setTranslatedText('');
      }
    }, 2000), // 2秒の遅延
    []
  );

  const debouncedTranslateB = useCallback(
    debounce(async (text) => {
      if (text) {
        try {
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: "gpt-3.5-turbo",
              messages: [
                {"role": "system", "content": "You are a translator. Translate the following Japanese text to English."},
                {"role": "user", "content": `${text}. Within 7 characters. No "." needed`}
              ]
            },
            {
              headers: {
                'Authorization': process.env.REACT_APP_CHATGPT_API_KEY,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log("英語に翻訳するAPIが発火");
          setInputTextB(response.data.choices[0].message.content.trim());
        //   setTranslatedText(response.data.choices[0].message.content.trim());
        } catch (error) {
          console.error('Translation error:', error);
        }
      } else {
        setInputTextB('');
        // setTranslatedText('');
      }
    }, 1500), // 2秒の遅延
    []
  );

  const handleInputChangeA = (e) => {
    const text = e.target.value;
    setInputTextA(text);

    // Debounced API call
    debouncedTranslateA(text);
  };
  const handleInputChangeB = (e) => {
    const text = e.target.value;
    setInputTextB(text);

    // Debounced API call
    debouncedTranslateB(text);
  };

  const handleGenerate = async () => {
    try{
        setLoading(true); // ローディング開始
        const imageResponse = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: `Create an image of a groundbreaking hybrid vegetable that seamlessly combines the edible parts of a ${inputTextA} and a ${inputTextB}. 
        The hybrid should be a unique and naturally integrated vegetable, blending the characteristics of both ${inputTextA} and ${inputTextB} into a cohesive whole. 
        The image should depict only one entire, fully intact hybrid vegetable without any cross-sectional views, slices, or cuts. Do not include any other vegetables, parts, or background elements in the image. 
        The hybrid should appear as a single, natural vegetable, as if it could exist in the real world.Be sure to comply with the following. 
        Do not generate images of cross sections of vegetables or cut vegetables.The subject must be one individual and uncut.
        The background must be plain white, with nothing else visible.
        `,
        n: 6,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAdviseIsLoading(true);
        setDisplayedAdvice('');
    
        try {
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: "gpt-3.5-turbo",
              messages: [
                {"role": "system", "content": "あなたは野菜の専門家です。"},
                {"role": "user", "content": `野菜の特徴として「${inputFeature1}」,「${inputFeature2}」,「${inputFeature3}」が挙げられます。このような特徴を持つ野菜は、生産者・消費者にとって、どんなメリットがあるか100文字程度で説明してください。`}
              ]
            },
            {
              headers: {
                'Authorization': process.env.REACT_APP_CHATGPT_API_KEY,
                'Content-Type': 'application/json',
              }
            }
          );
          adviceRef.current = response.data.choices[0].message.content;
          animateAdvice();
        //   setAdvice(response.data.choices[0].message.content);
        } catch (error) {
          console.error('Error:', error);
        //   setAdvice('エラーが発生しました。もう一度お試しください。');
        }
        setInputFeature1('');
        setInputFeature2('');
        setInputFeature3('');
    
        setAdviseIsLoading(false);
      };
      const animateAdvice = () => {
        let index = -1;
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
    
        intervalIdRef.current = setInterval(() => {
          setDisplayedAdvice((prev) => prev + adviceRef.current.charAt(index));
          index++;
    
          if (index >= adviceRef.current.length) {
            clearInterval(intervalIdRef.current);
          }
        }, 100); // 100msごとに文字を追加
      };
    
  return (
    <div>
        <div className='task-1-container'>
            <h1 className='head-text'>1. 新しい野菜のイメージを<spqn className="accent">生成AI</spqn>で作ってみよう</h1>
            <div>
                <h2 className='head-text2'>好きな野菜を２つ入力しよう</h2>
            </div>
            <div className='flex-container'>
                <div className='input-vegetable'>
                    <h2 className='vegetable'>野菜 A 🍅</h2>
                    <input
                        type="text"
                        size="35"
                        value={inputTextA}
                        onChange={handleInputChangeA}
                        placeholder="　例）トマト "
                        className='input-text'
                    />
                </div>
                <div>
                    <h1>➕</h1>
                </div>
                <div className='input-vegetable'>
                    <div className="vegetableB">
                        <h2 className='vegetable'>野菜 B </h2>
                        <img src={`${process.env.PUBLIC_URL}/okura.jpeg`} alt="Sample" className="resized-image-okura" />
                    </div>
                    <input
                        type="text"
                        size="35"
                        value={inputTextB}
                        onChange={handleInputChangeB}
                        placeholder="　例）オクラ"
                        className='input-text'
                    />
                </div>
            </div>
            <button onClick={handleGenerate} disabled={loading} className='btn_19'>
                {loading ? '生成中です...' : '画像を生成する'}
            </button>
            <div className='union-vegetable-text'>
                <p>「{inputTextA}」と「{inputTextB}」を<span style={{ fontWeight: 'bold' }}>ChatGPT</span>で合成すると...</p>
            </div>
            <div className='images-container'>
                {imageUrls.map((imageUrl, index) => (
                    imageUrl && <img key={index} src={imageUrl} alt={`Generated ${index}`} style={{ maxWidth: '130px', height: 'auto' }} />
                ))}
            </div>
        </div>
        <div className='task-2-container'>
            <div className='head-2'>
                <h1 className='head-text'>2. 野菜の専門家 ChatGPTさん</h1>
                <div>
                    <Tooltip text="This is a tooltip!">
                    野菜の専門家 ChatGPTさんとは?
                    </Tooltip>
                </div>  
                <h2 className='head-text2'>特徴は？（例えば、「病気に強い」「収穫量が多い」...）</h2>
            </div>
            <div>
                <div className='feature-input-container'>
                <h2 className='features'>特徴１　:　</h2>
                <input
                    type="text"
                    size="55"
                    value={inputFeature1}
                    onChange={(e) => setInputFeature1(e.target.value)}
                    placeholder="　病気に強い品種"
                    className='input-text'
                />
                </div>
                <div className='feature-input-container'>
                    <h2 className='features'>特徴２　:　</h2>
                    <input
                        type="text"
                        size="55"
                        value={inputFeature2}
                        onChange={(e) => setInputFeature2(e.target.value)}
                        placeholder="　収穫量が多いトマト"
                        className='input-text'
                    />
                </div>
                <div className='feature-input-container'>
                    <h2 className='features'>特徴３　:　</h2>
                    <input
                        type="text"
                        size="55"
                        value={inputFeature3}
                        onChange={(e) => setInputFeature3(e.target.value)}
                        placeholder="　全然美味しくない野菜"
                        className='input-text'
                    />
                </div>
            </div>
            <div style={{ maxWidth: '600px', height: 'auto' }}>
                <button onClick={handleSubmit} className='btn_19'>{adviseIsLoading ? '生成中です...' : 'アドバイスを生成'}</button>
                <div className='advice-container'>
                    <div className='advice-text'>
                        {displayedAdvice && (
                            <h3>"ChatGPTさんからのアドバイス"</h3>
                        )}
                        {displayedAdvice}

                    </div>
                </div>
            </div>
        </div>
        <footer className='footer'>
          <p>© 2024 久留米工業大学 AI応用研究所</p>
        </footer>
    </div>
  );
}

export default ImageGenApp;