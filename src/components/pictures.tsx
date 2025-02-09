import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { picturesSelector, counterSelector } from '../reducer';
import ModalPortal from './modal';

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  margin: 10px;
  object-fit: contain;
  transition: transform 1s;
  width: calc(20% - 20px); /* Ajuster pour afficher les vignettes de manière ordonnée */
  &:hover {
    transform: scale(1.2);
  }
`;

const Pictures = () => {
  const pictures = useSelector(picturesSelector);
  const counter = useSelector(counterSelector);
  const [selectedPicture, setSelectedPicture] = useState<null | string>(null); 

  const picturesToDisplay = pictures.status === 'success' 
                ? pictures.data.slice(0, Math.min(counter, pictures.data.length)) : [];

  const handleClickPicture = (largeFormat: string) => {
    setSelectedPicture(largeFormat); 
  };

  const closeModal = () => {
    setSelectedPicture(null); 
  };

  return (
    <Container>
      {pictures.status === 'loading' && <p>Chargement des images...</p>}
      
      {pictures.status === 'failure' && <p>Erreur : {pictures.error}</p>}
      {pictures.status === 'success' &&
        picturesToDisplay.map((picture, index) => (
          <Image
            key={index}
            src={picture.previewURL}
            alt={`Picture ${index + 1}`}
            onClick={() => handleClickPicture(picture.largeImageURL)}
          />
        ))}
      {selectedPicture && <ModalPortal largeFormat={selectedPicture} close={closeModal} />}
    </Container>
  );
};

export default Pictures;
