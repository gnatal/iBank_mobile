import styled from 'styled-components/native';

export const HeaderCard = styled.View`
  width: 100%;
  max-width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex-flow: row;
`;

export const IconHeaderCard = styled.Image`
  width: 100%;
  max-width: 24px;
`;

export const TextHeaderCard = styled.Text`
  font-size: 18px;
  font-weight: 700;
  text-align: left;
  color: #9b9b9b;
  padding-left: 10px;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ViewClose = styled.TouchableOpacity`
  position: absolute;
  top: 15px;
  right: 15px;
`;

export const ModalView = styled.View`
  position: relative;
  margin: 20px;
  width: 90%;
  background-color: #fff;
  border-radius: 10px;
  padding: 35px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 2px;
  elevation: 5;
`;

export const ModalTitle = styled.Text`
  font-size: 24px;
  margin-bottom: 15px;
`;

export const ModalInput = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  margin: 20px 0;
  padding: 5px;
`;

export const RowLastHistoric = styled.View`
  width: 100%;
  max-width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const LineRowSeparatorHistoric = styled.Text`
  color: #878686;
  font-size: 20px;
`;

export const ViewPlans = styled.View`
  width: 100%;
  max-width: 250px;
  justify-content: center;
  align-items: center;
  border: 2px solid #4a148c;
  border-radius: 10px;
  margin-top: 15px;
  padding: 25px 0;
`;
export const ViewAdd = styled.TouchableOpacity`
  width: 100%;
  max-width: 250px;
  justify-content: center;
  align-items: center;
  border: 2px solid #4a148c;
  border-radius: 10px;
  margin-top: 15px;
  padding: 9px 0;
`;

export const TextViewPlans = styled.Text`
  font-size: 14px;
  color: #000000;
  text-align: center;
`;

export const LettersViewPlans = styled.Text`
  position: absolute;
  top: -10px;
  right: -10px;
  color: #fff;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 30px;
  width: 30px;
  padding-top: 4px;
  /* background-color: rgb(140, 82, 229); */
  background-color: #4a148c;
  border-radius: 50px;
  font-size: 16px;
`;
