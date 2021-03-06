import React from "react";
import { ContainerLogo, LogoGama } from "./styles";

interface ContainerLogoProps {
    mTop?: string,
    mBottom?: string,
}

const ContainerLogoGama: React.FC<ContainerLogoProps> = ({
    mTop,
    mBottom
}) => {

    return (
        <ContainerLogo _mTop={mTop} _mBottom={mBottom}>
            <LogoGama width={50} height={20} source={require('../../assets/ibank-logo-white.png')} />
        </ContainerLogo>
    );
};

export default ContainerLogoGama;
