import { FormHandles } from '@unform/core';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import ContainerScroll from '../../components/ContainerScrollView';
import ContainerViewLoginRegister from '../../components/ContainerViewLoginRegister';
import ContainerLogoGama from '../../components/LogoGama';
import WhiteCardLoginRegister from '../../components/WhiteCardLoginRegister';
import ForgotPassordForm from './Form';

interface IForgotPasswdForm {
    email: string;
    login: string;
}

export default function ForgotPasswd() {


    return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}
            behavior={Platform.OS === "ios" ? "padding" : "height"} enabled
            keyboardVerticalOffset={10}>
            <ContainerScroll>
                <ContainerLogoGama mTop="50px" mBottom="20px" />
                <ContainerViewLoginRegister>
                    <WhiteCardLoginRegister title="Redefinir senha">
                        <ForgotPassordForm />
                    </WhiteCardLoginRegister>
                </ContainerViewLoginRegister>
            </ContainerScroll>
        </KeyboardAvoidingView>
    );
}
