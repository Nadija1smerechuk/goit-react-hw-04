import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { getPhotos } from '../../Unsplash';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import ImageGallery from '../ImageGallery/ImageGallery';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ImageModal from '../ImageModal/ImageModal';


export default function App({onSubmit}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    if (!query) {
      return;
    }
    
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const {results, total, total_pages} = await getPhotos(query, page);
      if (!results.length) {
        return setIsEmpty(true);
      }
      setImages(prevImages => [...prevImages, ...results]);
      setIsVisible(page < Math.ceil(total / total_pages));

    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }
      fetchData();
  }, [page, query]);

  const onHandleSubmit = (value) => {
    setQuery(value);
    setImages([]);
    setPage(1);
    setError(null);
    setIsEmpty(false);
    setIsVisible(false);
    
  }


  const openModal = (imageData) => {
    setSelectedImage(imageData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  }
  
  return (
    <>
      <SearchBar onSubmit={onHandleSubmit}/>
      {images.length > 0 && <ImageGallery images={images}  onImageClick={openModal} />}
      <ImageModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        imageData={selectedImage}
      />
      {isVisible && images.length > 0 && <LoadMoreBtn onClick={onLoadMore} disable={isLoading} />}
      
      {isLoading && <Loader isLoading={isLoading} />}
      {error && <ErrorMessage />}
    </>
  );
}


