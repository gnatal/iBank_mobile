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
    incomeSum?: number;
    outcomeSum?: number;
}


export default function PlansCard({ hideInfo, incomeSum, outcomeSum }: IProps) {

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
                    Planos de conta
            </S.TextHeaderCard>
            </S.HeaderCard>
            <HidableValue
                condition={hideInfo}
                value={
                    <>
                        <S.PlanAccountContentCard>
                            <TextHistoricBalance>
                                Tipo do plano: Entradas
                        </TextHistoricBalance>
                            <TextBalance>
                                <FormattedBRL
                                    value={incomeSum}
                                />
                            </TextBalance>
                        </S.PlanAccountContentCard>
                        <S.PlanAccountCard>
                            <S.TextExpense>
                                Tipo do plano: Saídas
                        </S.TextExpense>
                            <TextBalance _Color="#F45F5F">
                                <FormattedBRL
                                    value={outcomeSum}
                                />
                            </TextBalance>
                        </S.PlanAccountCard>
                    </>
                }
            />
        </WhiteCardDashboard>
    )

}