import React, { useRef, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Input from '../../../components/Input';
import api from '../../../services/api';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../../utils/getValidationErrors';

import ButtonPrimary from '../../../components/ButtonPrimary';
import { LinksBottom } from '../styles';


interface IForgotPasswdForm {
    email: string;
    login: string;
}


export default function ForgotPassordForm() {

    const [loading, setLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);
    const loginInputRef = useRef<TextInput>(null);


    const navigation = useNavigation();

    function navLogin() {
        navigation.navigate('Login');
        // redirecionar para screen de login
    }

    function navCreateAccount() {
        navigation.navigate('CreateAccount');
        // redirecionar para screen de criar conta
    }


    const submitFormButton = () => {
        formRef.current?.submitForm();
    };

    async function generateTmpPasswd({ email, login }: IForgotPasswdForm) {
        try {
            // Start by cleaning errors
            formRef.current?.setErrors({});

            const schema = Yup.object({
                email: Yup.string()
                    .trim()
                    .email('Insira um e-mail válido')
                    .required('Email obrigatório.'),
                login: Yup.string().trim().required('Login obrigatório'),
            });

            await schema.validate({ email, login }, { abortEarly: false });

            setLoading(true);

            const postData = {
                email,
                login,
            };

            const { data: senhaTemporaria } = await api.post(
                'nova-senha',
                postData
            );
            navigation.navigate('RedefinePassword', {
                senhaTemporaria,
                login,
            });
        } catch (err) {
            setLoading(false);
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
                // This is the way to set errors with unform. Each key is the input name and
                // it will be set on the 'error' variable coming from the useField hook in the Comp
                formRef.current?.setErrors(errors);
                return;
            }
            console.log(err);
        }
    }

    return (<Form
        ref={formRef}
        onSubmit={generateTmpPasswd}
        style={{ width: '100%' }}
    >
        <Input
            name="email"
            placeholder="Digite seu E-mail"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => {
                // Check out Input comp to details on this custom focus method
                loginInputRef.current?.focus();
            }}
        />
        <Input
            ref={loginInputRef}
            name="login"
            placeholder="Digite seu Login"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={submitFormButton}
        />
        <ButtonPrimary
            title="Continuar"
            iconName="arrow-right"
            iconColor="#FFF"
            iconSize={25}
            marginTop="60px"
            marginBottom="30px"
            onPress={submitFormButton}
            _loading={loading}
        />
        <LinksBottom onPress={navLogin}>
            Ir para Login{' '}
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
    </Form>)
}