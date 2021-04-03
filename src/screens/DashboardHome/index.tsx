import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContainerViewDashboard from '../../components/ContainerDashboard';
import ContainerScroll from '../../components/ContainerScrollView';
import FormattedBRL from '../../components/FormattedBRL';
import HidableValue from '../../components/HidableValue';
import MoneyLoader from '../../components/MoneyLoader';
import TextBalance from '../../components/TextBalance';
import TextHistoricBalance from '../../components/TextHistoricBalance';
import TransactionItem from '../../components/TransactionItem';
import WhiteCardDashboard from '../../components/WhiteCardDashboard';
import { DrawerParamList } from '../../navigation/drawer';
import api from '../../services/api';
import { IRootState } from '../../store';
import {
    accountDataSuccess,
    toggleTransactionVisibility,
    transactionTypesSuccess
} from '../../store/modules/accounts/actions';
import { logOutUser } from '../../store/modules/user/actions';
import { getDateInfo } from '../../utils/helpers';
import BalanceCard from './BalanceCard';
import PlansCard from './PlansCard';
//
import * as S from './styles';

type DashboardHomeNavigationProp = DrawerNavigationProp<
    DrawerParamList,
    'DashboardHome'
>;

type Props = {
    navigation: DashboardHomeNavigationProp;
};

const DashboardHome: React.FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: IRootState) => state.user);
    const { loading, debitAccount, transactions, hideInfo } = useSelector(
        (state: IRootState) => state.accounts
    );

    async function removeAuthData() {
        await AsyncStorage.multiRemove([
            '@tokenApp',
            '@loginApp',
            '@userNameApp',
            '@cpfApp',
        ]);
        dispatch(logOutUser());
    }

    useEffect(() => {
        const [currentMonth] = getDateInfo();

        const params = {
            inicio: `${currentMonth!.year}-${currentMonth!.month}-01`,
            fim: `${currentMonth!.year}-${currentMonth!.month}-${currentMonth!.lastDay
                }`,
            login: user!.login,
        };

        const headers = {
            Authorization: user!.token,
        };

        async function getApiInfo() {
            try {
                const [
                    { data: accounts },
                    { data: tTypes },
                ] = await Promise.all([
                    api.get(`/dashboard`, {
                        params,
                        headers,
                    }),

                    api.get('/lancamentos/planos-conta', {
                        params,
                        headers,
                    }),
                ]);
                dispatch(accountDataSuccess(accounts));
                dispatch(transactionTypesSuccess(tTypes));
            } catch (err) {
                if (err.response?.data.error === 'ExpiredJwtException') {
                    removeAuthData();
                    return;
                }
            }
        }

        getApiInfo();
    }, [dispatch]);

    let debitBalance;
    let debitTransactions;
    let debitTransactionsSum;
    let income;
    let outcome;
    let incomeSum;
    let outcomeSum;

    if (!loading) {
        debitBalance = debitAccount!.saldo;
        debitTransactions = transactions?.filter((tr) => !tr.isCredit);
        debitTransactionsSum = debitTransactions!.reduce(
            (acc, item) => acc + item.valor,
            0
        );

        income = transactions?.filter((tr) => tr.valor > 0);
        outcome = transactions?.filter((tr) => tr.valor < 0);
        incomeSum = income!.reduce((acc, item) => acc + item.valor, 0);
        outcomeSum = outcome!.reduce((acc, item) => acc + item.valor, 0);
    }

    const toggleHideInfo = () => dispatch(toggleTransactionVisibility());

    return (
        <ContainerScroll  _bgColor="#c4c5c7">
            <ContainerViewDashboard>
                <S.HeaderDashboard>
                    <S.TextHeaderDashboard>
                        Olá, {user?.userName}
                    </S.TextHeaderDashboard>
                    <S.ContainerIcon>
                        <S.IconEye onPress={toggleHideInfo}>
                            <Ionicons
                                name="ios-eye-outline"
                                size={33}
                                color="#50c878"
                            />
                        </S.IconEye>
                        <S.IconHeaderDashboard
                            onPress={() => navigation.openDrawer()}
                        >
                            <Ionicons
                                name="md-person-outline"
                                size={33}
                                color="#50c878"
                            />
                        </S.IconHeaderDashboard>
                    </S.ContainerIcon>
                </S.HeaderDashboard>

                {loading ? (
                    <MoneyLoader />
                ) : (
                    <>
                        <BalanceCard
                            hideInfo={hideInfo}
                            debitBalance={debitBalance}
                            debitTransactionsSum={debitTransactionsSum}
                        />
                        <PlansCard

                            hideInfo={hideInfo}
                            incomeSum={incomeSum}
                            outcomeSum={outcomeSum}

                        />
                        <WhiteCardDashboard
                            _MarginBottom="150px"
                            _Padding="20px 20px 60px"
                        >
                            <S.HeaderCard>
                                <MaterialCommunityIcons
                                    name="currency-usd-circle-outline"
                                    size={30}
                                    color="#50c878"
                                />
                                <S.TextHeaderCard>
                                    Últimos Lançamentos
                                </S.TextHeaderCard>
                            </S.HeaderCard>

                            {hideInfo ? (
                                <HidableValue condition={hideInfo} />
                            ) : (
                                <>
                                    {transactions && transactions![0] ? (
                                        transactions!.map((tr) => (
                                            <TransactionItem
                                                key={tr.id}
                                                valor={tr.valor}
                                                data={tr.data}
                                                descricao={tr.descricao}
                                                tipo={tr.tipo}
                                            />
                                        ))
                                    ) : (
                                        <S.TextHeaderCard _mTop="20px">
                                            Não existem lançamentos.
                                        </S.TextHeaderCard>
                                    )}
                                </>
                            )}
                        </WhiteCardDashboard>
                    </>
                )}
            </ContainerViewDashboard>
        </ContainerScroll>
    );
};

export default DashboardHome;
