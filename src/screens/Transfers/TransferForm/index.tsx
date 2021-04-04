import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import * as Yup from 'yup';
import ButtonPrimary from '../../../components/ButtonPrimary';
import Input from '../../../components/Input';
import InputMasked from '../../../components/InputMasked';
import WhiteCardDashboard from '../../../components/WhiteCardDashboard';
import api from '../../../services/api';
import { IRootState } from '../../../store';
import { debitTransactionSuccess } from '../../../store/modules/accounts/actions';
import getValidationErrors from '../../../utils/getValidationErrors';
import { createFloat } from '../../../utils/helpers';
import * as S from '../styles';

interface ITransferForm {
    descricao: string;
    valor: number;
    destinatario: string;
}

export function TransferForm() {
  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [missingDate, setMissingDate] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const formRef = useRef<FormHandles>(null);
  const descInputRef = useRef<TextInput>(null);
  const valueInputRef = useRef<TextInput>(null);
  
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { debitAccount, transactionTypes } = useSelector(
    (state: IRootState) => state.accounts
  );

  const { user } = useSelector((state: IRootState) => state.user);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (chosenDate: Date) => {
    setDate(chosenDate.toISOString().substring(0, 10));
    setMissingDate(false);
    hideDatePicker();
  };

  const navDashboard = () => {
    setLoading(false);
    navigation.navigate('Home');
  };

  const submitFormButton = () => {
    formRef.current?.submitForm();
  };

  async function handleSubmit({
    descricao,
    valor,
    destinatario,
  }: ITransferForm) {
    try {
      valor = valor && createFloat(valor);
      formRef.current?.setErrors({});

      const schema = Yup.object({
        destinatario: Yup.string()
          .required('Campo obrigatório')
          .trim()
          .min(2, 'Mínimo de 2 caracteres')
          .max(10, 'Máximo de 10 caracteres'),
        descricao: Yup.string()
          .required('Campo obrigatório')
          .trim()
          .min(2, 'Mínimo de 2 caracteres')
          .max(10, 'Máximo de 10 caracteres'),
        valor: Yup.number()
          .max(9999.99, 'Valor máximo de R$ 9.999,99')
          .required('Campo obrigatório'),
      });

      await schema.validate(
        { descricao, valor, destinatario },
        { abortEarly: false }
      );

      if (!date) {
        setMissingDate(true);
        return;
      }

      setLoading(true);

      const planoConta = transactionTypes!['TU'][0];

      const postData = {
          conta: debitAccount!.id,
          contaDestino: destinatario,
          data: date,
          descricao,
          login: user!.login!,
          valor,
          planoConta: planoConta.id,
      };

            const headers = { Authorization: user!.token! };

            await api.post(`lancamentos`, postData, { headers });
            dispatch(
                debitTransactionSuccess({
                    ...postData,
                    // Id must be created here since the API don't return it
                    id: shortid(),
                    valor: Number(valor),
                    planoConta,
                })
            );
            formRef.current?.setFieldValue(descricao, '');
            navDashboard();
        } catch (err) {
            setLoading(false);
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors);
                return;
            }
        }
    }
    return (

        <WhiteCardDashboard
            _MarginBottom="130px"
            _Padding="20px 20px 40px"
        >
            <S.HeaderCard>
                <S.IconHeaderCard
                    source={require('../../../assets/icon-money.png')}
                />
                <S.TextHeaderCard>Transferências</S.TextHeaderCard>
            </S.HeaderCard>
            <S.DepositForm ref={formRef} onSubmit={handleSubmit}>
                <Input
                    name="destinatario"
                    placeholder="Destinatário"
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        // Check out Input comp to details on this custom focus method
                        descInputRef.current?.focus();
                    }}
                />
                <Input
                    name="descricao"
                    placeholder="Descrição"
                    autoCorrect={false}
                    ref={descInputRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        // Check out Input comp to details on this custom focus method
                        valueInputRef.current?.focus();
                    }}
                />

                <InputMasked
                    mask="BRL"
                    name="valor"
                    placeholder="Valor de depósito"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    ref={valueInputRef}
                />

                <ButtonPrimary
                    onPress={showDatePicker}
                    title="Selecione uma data"
                    iconName="calendar"
                    iconColor="#fff"
                    iconSize={25}
                    marginTop="40px"
                    marginBottom="20px"
                    bgColor={missingDate ? '#e6505c' : '#8c52e5'}
                    color="#fff"
                />

                {missingDate && (
                    <S.DateError>
                        Por favor selecione uma data
                    </S.DateError>
                )}

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    minimumDate={new Date()}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

                <ButtonPrimary
                    title="Realizar transferência"
                    iconName="arrow-right"
                    iconColor="#fff"
                    iconSize={25}
                    onPress={submitFormButton}
                    marginTop="20px"
                    marginBottom="30px"
                    bgColor="#63dc3f"
                    color="#fff"
                    _loading={loading}
                />
            </S.DepositForm>
        </WhiteCardDashboard>

    )
}