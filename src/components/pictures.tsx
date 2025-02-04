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

  const picturesToDisplay = pictures.slice(0, Math.min(counter, pictures.length));

  const handleClickPicture = (largeFormat: string) => {
    setSelectedPicture(largeFormat); 
  };

  const closeModal = () => {
    setSelectedPicture(null); 
  };

  return (
    <Container>
      {picturesToDisplay.map((picture, index) => (
        <Image
          key={index}
          src={picture.previewFormat}
          alt={`Picture ${index + 1}`}
          onClick={() => handleClickPicture(picture.largeFormat)} 
        />
      ))}
      {selectedPicture && <ModalPortal largeFormat={selectedPicture} close={closeModal} />}
    </Container>
  );
};

export default Pictures;
