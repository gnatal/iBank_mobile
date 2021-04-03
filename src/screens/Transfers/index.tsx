import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import ContainerViewDashboard from '../../components/ContainerDashboard';
import ContainerScroll from '../../components/ContainerScrollView';
import { IRootState } from '../../store';
import * as S from './styles';
import { TransferForm } from './TransferForm';




export default function Transfers() {

    const navigation = useNavigation();

    const { user } = useSelector((state: IRootState) => state.user);


    return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}
            behavior={Platform.OS === "ios" ? "padding" : "height"} enabled
            keyboardVerticalOffset={100}>
            <ContainerScroll _bgColor="#c4c5c7">
                <S.HeaderDashboard>
                    <S.TextHeaderDashboard>Olá, {user?.userName}</S.TextHeaderDashboard>
                    <S.CloseButton onPress={() => navigation.goBack()}>
                        <Feather name="x" size={33} color="#fff" />
                    </S.CloseButton>
                </S.HeaderDashboard>
                <ContainerViewDashboard>
                    <TransferForm />
                </ContainerViewDashboard>
            </ContainerScroll>
        </KeyboardAvoidingView>
    );
}
