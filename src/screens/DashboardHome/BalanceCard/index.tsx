import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import FormattedBRL from '../../../components/FormattedBRL';
import HidableValue from '../../../components/HidableValue';
import TextBalance from '../../../components/TextBalance';
import TextHistoricBalance from '../../../components/TextHistoricBalance';
import WhiteCardDashboard from '../../../components/WhiteCardDashboard';
import * as S from '../styles';


interface IProps {
    hideInfo: boolean,
    debitBalance?: number;
    debitTransactionsSum?: number;
}


export default function BalanceCard({ hideInfo, debitBalance, debitTransactionsSum }: IProps) {

    return (
        <WhiteCardDashboard
            _MarginBottom="30px"
            _Padding="20px"
        >
            <S.HeaderCard>
                <MaterialCommunityIcons
                    name="currency-usd-circle-outline"
                    size={30}
                    color="#50c878"
                />
                <S.TextHeaderCard>
                    Saldo da conta
            </S.TextHeaderCard>
            </S.HeaderCard>
            <S.ContentCard>
                <TextBalance>
                    <HidableValue
                        condition={hideInfo}
                        value={
                            <FormattedBRL
                                value={debitBalance}
                            />
                        }
                    />
                </TextBalance>
                <TextHistoricBalance>
                    {!hideInfo && (
                        <>
                            Lançamentos no mês:{' '}
                            <FormattedBRL
                                value={debitTransactionsSum}
                            />
                        </>
                    )}
                </TextHistoricBalance>
            </S.ContentCard>
        </WhiteCardDashboard>
    )

}