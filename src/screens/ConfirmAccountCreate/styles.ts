import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

export const Container = styled.View`
    width: ${Dimensions.get('window').width}px;
    height: ${Dimensions.get('window').height}px;
    flex: 1;
    flex-flow: column;
`;

export const ContainerConfirmation = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const ImageBackground = styled.View`
    width: 80%;
    flex: 0.5;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    background-color: #4a148c;
`;

export const ImageConfirmation = styled.Image`
    max-width: 162px;
    width: 100%;
`;

export const TextConfirmation = styled.Text`
    margin-top: 40px;
    font-size: 26px;
    border: solid 1px #fff;
    border-radius: 20px;
    padding: 10px;
    width: 80%;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
`;
