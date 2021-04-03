import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';

import api from '../../services/api';
import { logInUser } from '../../store/modules/user/actions';
import getValidationErrors from '../../utils/getValidationErrors';

import ContainerLogoGama from '../../components/LogoGama';
import Input from '../../components/Input';
import ButtonPrimary from '../../components/ButtonPrimary';
import ContainerViewLoginRegister from '../../components/ContainerViewLoginRegister';
import WhiteCardLoginRegister from '../../components/WhiteCardLoginRegister';
import ContainerScroll from '../../components/ContainerScrollView';
import { Checkbox } from '../../components/Checkbox';

import { LinksBottom, LoginForm } from './styles';
import { getData, storeData } from '../../utils/helpers';

interface ILoginForm {
  login: string;
  passwd: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [usernameInput, setUsernameInput] = useState('')
  const [passInput, setPassInput] = useState('')

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const getStoredData = async () => {
      const rememberMe = await getData('@remember-me');
      if (!rememberMe) return false;
      setToggleCheckBox(true);
      const values = await AsyncStorage.multiGet(['@user', '@pass']);
      const user = values[0][1];
      const pass = values[1][1];
      if (user)
        setUsernameInput(user);
      if (pass)
        setPassInput(pass)
    }
    
    getStoredData();
  },[]);

  const handleSubmit = async (data: ILoginForm) => { 
    data.login = usernameInput;
    data.passwd = passInput;
    const { login, passwd } = data;

    try {
      // Start by cleaning errors
      formRef.current?.setErrors({});
      
      const schema = Yup.object({
        login: Yup.string().trim().min(5).required('Campo obrigatório.'),
        passwd: Yup.string().trim().required('Campo obrigatório'),
      });
      
      await schema.validate(data, { abortEarly: false });
      
      setLoading(true);

      const postData = {
        usuario: login,
        senha: passwd,
      };
      const passToStore = ['@pass', passwd];
      const userToStore = ['@user', login];
      api.defaults.headers.Authorization = null;

      await api.post(`login`, postData).then(async ({ data }) => {
        await AsyncStorage.multiRemove([
          '@tokenApp',
          '@loginApp',
          '@userNameApp',
          '@cpfApp',
        ]);
        const token = ['@tokenApp', data.token];
        const login = ['@loginApp', data.usuario.login];
        const cpf = ['@cpfApp', data.usuario.cpf];
        const userName = [
          '@userNameApp',
          data.usuario.nome.split(' ')[0],
        ];
        

        await AsyncStorage.multiSet([token, login, cpf, userName, passToStore, userToStore]);
        api.defaults.headers.Authorization = data.token;
        dispatch(
          logInUser({
            token: token[1],
            userName: userName[1],
            login: login[1],
            cpf: cpf[1],
          })
        );
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
    }
  }

  function navForgetPassword() {
    navigation.navigate('ForgotPasswd');
  }

  function navCreateAccount() {
    navigation.navigate('CreateAccount');
  }

  const submitFormButton = () => {
    formRef.current?.submitForm();
  };

  const handleCheckboxChange = async (value: boolean) => {
    setToggleCheckBox(value);
    if (value) await storeData('@remember-me', 'on');
    else await AsyncStorage.removeItem('@remember-me');
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
      keyboardVerticalOffset={10}
    >
    <ContainerScroll>
      <SafeAreaView />
      <ContainerLogoGama mTop="50px" mBottom="20px" />
        <ContainerViewLoginRegister>
          <WhiteCardLoginRegister title="Seja bem vindo, informe seus dados para logar.">
            <LoginForm ref={formRef} onSubmit={handleSubmit}>
              <Input
                name="login"
                placeholder="Digite seu usuário"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                value={usernameInput}
                onChangeText={(value) => setUsernameInput(value)}
                onSubmitEditing={() => {passwordInputRef.current?.focus()}}
              />
              <Input
                ref={passwordInputRef}
                name="passwd"
                placeholder="Digite sua Senha"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                returnKeyType="send"
                value={passInput}
                onChangeText={(value) => setPassInput(value)}
                onSubmitEditing={submitFormButton}
              />

              <Checkbox
                text={'Lembrar usuário'}
                value={toggleCheckBox}
                onCheckboxChange={handleCheckboxChange}
              />

              <ButtonPrimary
                title="Continuar"
                iconName="arrow-right"
                iconColor="#fff"
                iconSize={25}
                marginTop="20px"
                marginBottom="30px"
                bgColor="#50c878"
                color="#fff"
                onPress={submitFormButton}
                _loading={loading}
              />
              <LinksBottom onPress={navForgetPassword}>
                Esqueci minha senha{' '}
                <Feather
                  name="chevron-right"
                  size={13}
                  color="#8C52E5"
                />
              </LinksBottom>
              <LinksBottom onPress={navCreateAccount}>
                Ainda não sou cliente{' '}
                <Feather
                  name="chevron-right"
                  size={13}
                  color="#8C52E5"
                />
              </LinksBottom>
            </LoginForm>
          </WhiteCardLoginRegister>
        </ContainerViewLoginRegister>
      </ContainerScroll>
    </KeyboardAvoidingView>
  );
}
