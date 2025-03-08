import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { picturesSelector, getSelectedPicture } from '../reducer';
import ModalPortal from './modal';
import { isSome } from 'fp-ts/lib/Option';
import { closeModal, fetchCatsRequest, selectPicture } from '../actions';

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
  const selectedPicture = useSelector(getSelectedPicture);
  const dispatch = useDispatch(); 

  useEffect(() => {
    dispatch(fetchCatsRequest(3));
  }, [dispatch]);

  return (
    <Container>
      {pictures.status === 'loading' && <p>Chargement des images...</p>}
      
      {pictures.status === 'failure' && <p>Erreur : {pictures.error}</p>}
      {pictures.status === 'success' &&
        pictures.data.map((picture, index) => (
          <Image
            key={index}
            src={picture.previewURL}
            alt={`Picture ${index + 1}`}
            onClick={() => dispatch(selectPicture(picture))}
          />
        ))}
      {isSome(selectedPicture) && (
        <ModalPortal largeFormat={selectedPicture.value.largeImageURL} close={() => dispatch(closeModal())} />
      )}
    </Container>
  );
};

export default Pictures;
