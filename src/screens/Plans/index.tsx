import React, { useState } from "react";
import { Modal } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import Toast from 'react-native-tiny-toast';

import * as S from "./styles";
import ContainerScroll from "../../components/ContainerScrollView";
import ContainerViewDashboard from "../../components/ContainerDashboard";
import WhiteCardDashboard from "../../components/WhiteCardDashboard";
import { IRootState } from "../../store";

import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import api from '../../services/api';
import { transactionTypesSuccess } from '../../store/modules/accounts/actions';
import { IPlanoConta } from '../../store/modules/accounts/types';
import ButtonPrimary from '../../components/ButtonPrimary';

export default function Plans() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ItemValue>('');
  const [description, setDescription] = useState('');

  const { user } = useSelector((state: IRootState) => state.user);
  const { transactionTypes } = useSelector((state: IRootState) => state.accounts);
  const dispatch = useDispatch();

  const transactionTypesKeys = transactionTypes && Object.keys(transactionTypes);

  const handleOpenAddPlan = () => {
    setModalVisible(true);
  }

  const handleAddPlan = async () => {

    if (!selectedType || description.length === 0) {
      return Toast.show('Preencha todos os campos!', {
        containerStyle: { borderRadius: 20, padding: 12, backgroundColor: 'red' }
      });
    }
    setLoading(true);
    if (transactionTypes) {
      if (user?.login) {
        const data = {
          descricao: description,
          id: 0,
          login: user.login,
          padrao: true,
          tipoMovimento: String(selectedType)
        }

        const plans = Object.values(transactionTypes);
        const newPlans: IPlanoConta[] = [data];
        plans.forEach(type => {
          type.forEach(plan => {
            newPlans.push(plan);
          })
        })
        await api.post('lancamentos/planos-conta', data, {
          headers: {
            Authorization: user?.token,
          }
        })
          .then(response => {
            setLoading(false);
            if (response.status === 200) {
              dispatch(transactionTypesSuccess(newPlans));
              Toast.showSuccess('Plano adicionado com sucesso!')

              setModalVisible(false);
              setSelectedType('');
              setDescription('');
            } else {
              setLoading(false);
              Toast.show('Ocorreu algum erro!', {
                containerStyle: { borderRadius: 20, padding: 12, backgroundColor: 'red' }
              });
            }
          });
      }
    }
  }

  const handleTypeChange = (e: ItemValue, index: number) => {
    setSelectedType(e)
  }
  const handleDescriptionChange = (text: string) => {
    if (text.length <= 20) setDescription(text)
  }

  return (
    <ContainerScroll>
      <ContainerViewDashboard>
        <WhiteCardDashboard _MarginBottom="120px" _Padding="20px 20px 40px">
          <S.HeaderCard>
            <S.IconHeaderCard source={require('../../assets/icon-money.png')} />
            <S.TextHeaderCard>Planos</S.TextHeaderCard>
          </S.HeaderCard>

          <S.ViewAdd onPress={handleOpenAddPlan}>
            <Ionicons
              name={'add'}
              size={48}
            />
          </S.ViewAdd>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => { setModalVisible(true) }}
          >
            <S.ModalContainer>

              <S.ModalView>
                <S.ViewClose onPress={() => { setModalVisible(false) }}>
                  <Ionicons
                    name={'close-outline'}
                    size={36}

                  />
                </S.ViewClose>

                <S.ModalTitle>Adicionar um plano</S.ModalTitle>

                <Picker
                  selectedValue={selectedType}
                  onValueChange={handleTypeChange}
                  style={{ width: '100%', color: 'gray' }}
                >
                  <Picker.Item label="Escolha o tipo" value="" />
                  <Picker.Item label="Receita" value="R" />
                  <Picker.Item label="Despesa" value="D" />
                  <Picker.Item label="Transferência entre contas" value="TC" />
                  <Picker.Item label="Transferência entre usúarios" value="TU" />
                </Picker>

                <S.ModalInput
                  placeholder="Descrição"
                  value={description}
                  onChangeText={(value) => handleDescriptionChange(value)}
                />

                <ButtonPrimary
                  title="Realizar depósito"
                  iconName="arrow-right"
                  iconColor="#fff"
                  iconSize={25}
                  onPress={handleAddPlan}
                  marginTop="20px"
                  bgColor="#50c878"
                  color="#fff"
                  accessibilityLabel="add plan green button"
                  _loading={loading}
                />

              </S.ModalView>
            </S.ModalContainer>
          </Modal>

          {transactionTypesKeys?.map((key) =>
            transactionTypes![key].map((plan) =>
              <S.ViewPlans key={plan.id}>
                <S.TextViewPlans>
                  {plan.descricao}
                </S.TextViewPlans>

                <S.LettersViewPlans>
                  {plan.tipoMovimento}
                </S.LettersViewPlans>
              </S.ViewPlans>
            ))}
        </WhiteCardDashboard>
      </ContainerViewDashboard>
    </ContainerScroll>
  );
}
