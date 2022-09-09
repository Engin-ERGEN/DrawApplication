import { useEffect, useRef, useState } from 'react';
import './Main.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ParseCSV from './utils/ParseCSV'

const App = () => {

  const [element, setElement] = useState("");
  const [list, setList] = useState([]);
  const listRef = useRef([]);
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [tempResult, setTempResult] = useState(null);
  const [onProgress, setOnProgress] = useState(false);

  // Time
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const addElement = (e) => {
    e.preventDefault();
    if (element === "") {
      toast.warn('Lütfen kura çekimi için listeye değer ekleyiniz.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (isStarted) {
      toast.warn('Kura çekimi zaten başlamıştır.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // Let's Start!
    listRef.current = [...listRef.current, element];
    setList(listRef.current);
    setElement("");

  };

  const startDraw = (e) => {
    // Let's Start!
    setIsStarted(true);
    setOnProgress(true);

    const listLength = list.length;
    const random = randomInt(0, listLength);
    setResult(list[random]);
    setIsStarted(false);
  };

  const preStartDraw = (e) => {
    if (list.length <= 1) {
      toast.warn('Lütfen kura çekimi için listeye daha fazla değer ekleyiniz.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const interval = setInterval(() => {
      setOnProgress(true);

      timeRef.current += 50;
      setTime(timeRef.current);
      setTempResult(list[randomInt(0, list.length)]);

      if (timeRef.current === 3000) {
        clearInterval(interval);
        timeRef.current = 0;
        setTime(0);
        startDraw(e);
      }
    }, 50);
  };

  const addRandomName = () => {
    setList([]);
    listRef.current = [];

    const names = [
      'Ali', 'Necmiye', 'Alev', 'Melisa',
      'Engin', 'Kadriye', 'Kadir', 'Umut',
      'Cengiz', 'Melike', 'Lale', 'Leyla',
      'Hasan', 'Yeşim', 'Yaren', 'Sare',
      'Nusret', 'Sümeyye', 'Gülseren', 'Nayme',
      'Ümit', 'Emre', 'Muhammed', 'Hüseyin',
      'Gökhan', 'Adem', 'Narin', 'Aslı',
      'Sabri', 'Dilara', 'Doğa', 'Deniz',
      'Furkan', 'Derya', 'Emine', 'Zeynep', 'Zehra',
      'Sabri', 'Fatma', 'Zehra', 'Burcu', 'Elif',
      'Hilal', 'Ceren', 'Cemre', 'Çetin', 'Aynur',
      'Necla', 'Aysel', 'Ahmet', 'Adnan', 'Musa', 'İsa', 'Davut', 'Harun',
      'Hatice', 'Eylül', 'Melis', 'Seda', 'Sanem', 'Funda',
      'Salih', 'Attila', 'Ayaz', 'Cevat', 'Dursun', 'Ferhat', 'Galip',
      'İnan', 'Işın', 'Mahir', 'Melih', 'Ogün', 'Okyanus', 'Orçun',
      'Polat', 'Pak', 'Sergen', 'Tolga', 'Tahir', 'Varol', 'Uğur',
      'Umur', 'Veli', 'Vedat', 'Sezen', 'Sevinç', 'Tülay', 'Kemal', 'Algül', 'Kaan',
      'Nazlı', 'Pelin', 'Mutlu', 'Ülkü', 'Şebnem', 'Şirin', 'Şükrü', 'Şükran'
    ];

    const namesLength = names.length;

    for (let i = 0; i < 10; i++) {
      let name = names[randomInt(0, namesLength)];
      if (!listRef.current.some((item) => item === name)) {
        listRef.current.push(name);
        continue;
      }
      i--;
    }

    setList(listRef.current);
  };

  const removeItem = (e) => {
    listRef.current = listRef.current.filter((item) => item !== e.target.value);
    setList(listRef.current);
    console.log(listRef.current);
  };

  const uploadFile = async (e) => {
    const allowedTypes = [
      'text/csv'
    ];

    if (allowedTypes.indexOf(e.target.files[0].type) == -1) {
      toast.warn("Lütfen doğru dosya uzantısı ile yükleme yapınız.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    try {
      const csv_results = await ParseCSV(e.target.files[0]);
      listRef.current = [...listRef.current, ...csv_results.map(name => name.name)];
      setList(listRef.current);
      toast.success("Dosya içeriğini başarılı bir şekilde aktarıldı.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    catch (err) {
      toast.error("Geçersiz formatta bir dosya yüklediniz.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const restart = () => {
    setResult(null);
    listRef.current = [];
    setList([]);
    setOnProgress(false);
  };

  return (
    <div className='container'>
      <ToastContainer />
      <div className='row'>
        <div className='col-sm-12'>
          <form onSubmit={addElement}>
            <div className="mb-3">
              <label htmlFor="element" className="form-label draw-label">Eleman Giriniz: </label>
              <div className='d-flex flex-row'>
                <input value={element} onChange={(e) => { setElement(e.target.value) }} type="text" className="form-control draw-element" id="element" placeholder="Engin ERGEN" required />
                <button className="draw-button">EKLE</button>
              </div>
            </div>
          </form>
        </div>
        <div className='col-sm-12'>
          <h1 className='draw-label'>Listede {list.length} element var.</h1>
          <select onClick={removeItem} className="form-select" multiple aria-label="multiple select">

            {
              list.length > 0 ?
                (
                  list?.map((item, key) =>
                    <option key={key} value={item}>{item}</option>
                  )
                )
                :
                (
                  <option key="1" value="-1">Ekle</option>
                )
            }
          </select>

          {!isStarted && (
            <div className='d-sm-flex flex-row justify-content-center'>
              <button onClick={preStartDraw} className='draw-start'>Başlat</button>
              <button onClick={restart} className='draw-start'>Sıfırla</button>
              <button onClick={addRandomName} className='draw-start'>Rastgele</button>
              <input id='file' type='file' onChange={uploadFile} className='d-none' />
              <label className='draw-file' htmlFor="file">CSV</label>
            </div>
          )}

          {
            onProgress &&
            <div id="result" className='text-center'>
              <div className='resultContent'>
                {
                  result ?
                    <>
                      <h1 className='draw-label'>SONUÇ</h1>
                      <h2 className='result'>{result}</h2>
                      <div className='d-flex flex-row justify-content-center'>
                        <button onClick={(e) => { setOnProgress(false); setResult(null); setIsStarted(false); }} id="drawStartButton" className='draw-start'>Yeni Kişi Ekle</button>
                        <button onClick={(e) => { setResult(null); preStartDraw(e); }} className='draw-start'>Tekrar Çek</button>
                      </div>
                    </>
                    :
                    <div className='draw-spinner'>
                      <div className="m-4 spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className='text-light temp-result'>{tempResult}</p>
                    </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
