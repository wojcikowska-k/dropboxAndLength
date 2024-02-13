import React, {useCallback, useState, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import Image from 'next/image'
import {XMarkIcon } from '@heroicons/react/24/solid'

export const DropBox = ({className}) =>{
const [files, setFiles] = useState([]);
const [rejected, setRejected] = useState([])
const [totalLength, setTotalLength] = useState(0);
const [imageInfo, setImageInfo] = useState({});

const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
  if (acceptedFiles?.length) {
    const newFiles = acceptedFiles.filter(file => !files.some(existingFile => existingFile.name === file.name));
    const updatedFiles = newFiles.map((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          const imageElement = new window.Image();
          imageElement.onload = () => {
          
            const length = imageElement.height;
            const copies = '1';
            setTotalLength((prevLength) => prevLength + length);
            setImageInfo((prevImageInfo) => ({
              ...prevImageInfo,
              [file.name]: {length: length, copies: copies},
            }));
          };
          imageElement.src = reader.result;
        };

        reader.readAsDataURL(file);

        return Object.assign(file, { preview: URL.createObjectURL(file) });
      });

      setFiles((previousFiles) => [...previousFiles, ...updatedFiles]);
    }

  if (rejectedFiles?.length) {
    setRejected(previousFiles => [...previousFiles, ...rejectedFiles]);
    console.log('Wrong type of file')
  }
}, [files])


      const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
          'image/*': []
        },
        onDrop,
        noClick: true
      })

      const removeFile = (name) => {
        const length = imageInfo[name] || 0;
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
        setImageInfo((prevImageInfo) => {
          const newImageInfo = { ...prevImageInfo };
          delete newImageInfo[name];
          return newImageInfo;
        });
      };

      useEffect(() => {
        const totalLengthTimesCopies = Object.values(imageInfo).reduce((total, obj) => {
          const length = obj.length || 0;
          const copies = parseInt(obj.copies) || 1;
          return total + (length * copies);
        }, 0);
        setTotalLength(totalLengthTimesCopies);
      }, [imageInfo]);
    
      const handleChange = (event, fileName) => {
        setImageInfo((prevImageInfo) => ({
          ...prevImageInfo,
          [fileName]: {
            ...prevImageInfo[fileName],
            copies: event.target.value,
          },
        }));
      };

      const handlePrint = () => {
        window.print();
      };

      const formatPxToMb = (nbInPixels) => {
        const nbInMeters = Number(nbInPixels*0.000091).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return nbInMeters
      }
    
      return (
        <form>
        <div {...getRootProps({
            className: className
          })} >
          <input {...getInputProps()} />
      
        <ul className="list">
        {files.map(file => (
          <li key={file.name} className="list-item">
            <input
      className="copies-input"
      type="text"
      name="copies"
      value={imageInfo[file.name] ? imageInfo[file.name].copies : '1'}
      onChange={e => handleChange(e, file.name)}
    />
             <Image
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                className="image"
              />
           
              <button
                type='button'
                className='remove-btn'
                onClick={() => removeFile(file.name, file.height)}
              >
                <XMarkIcon className='remove-icon' />
              </button>
          </li>
          )
        )}
          </ul>
          </div>
          <p>Całkowita długość w pikselach: {totalLength} pikseli</p>
          <p>Całkowita długość w metrach: {formatPxToMb(totalLength)} metrów</p>
          <button className="print-btn" onClick={handlePrint}>Wydrukuj</button>
        </form>
      )
}

