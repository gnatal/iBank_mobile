import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import ContainerScroll from '../../components/ContainerScrollView';
import ContainerLogoGama from '../../components/LogoGama';
import {
    ContainerConfirmation,
    TextConfirmation,
    ImageConfirmation,
    Container,
    ImageBackground
} from './styles';
import ButtonPrimary from '../../components/ButtonPrimary';

export default function ConfirmAccountCreate() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (!(e.data.action.type === 'NAVIGATE')) {
                e.preventDefault();
                return;
            }
        });
    }, [navigation]);

    function navLogin() {
        navigation.navigate('Login');
    }

    return (
        <ContainerScroll>
            <Container>
                <ContainerLogoGama mTop="60px" />
                <ContainerConfirmation>
                    <ImageBackground>

                        <ImageConfirmation
                            source={require('../../assets/ok-create-account.png')}
                        />
                    </ImageBackground>
                    <TextConfirmation>
                        Conta criada com sucesso!
                    </TextConfirmation>
                    <ButtonPrimary
                        title="Login"
                        iconName="arrow-right"
                        iconColor="#fff"
                        iconSize={25}
                        style={{ width: "80%" }}
                        marginTop="20px"
                        marginBottom="30px"
                        bgColor="#63dc3f"
                        color="#fff"
                        onPress={navLogin}
                        _width="60%"
                    />
                </ContainerConfirmation>
            </Container>
        </ContainerScroll>
    );
}
