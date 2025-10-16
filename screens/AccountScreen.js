import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const AccountScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [bankAccountBalance, setBankAccountBalance] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/allExpenses');
      setExpenses(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  // --- Separate Income & Expense for each account type ---
  const cashIncome = expenses
    .filter(item => item.account === 'Cash' && item.type === 'Income')
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const cashExpense = expenses
    .filter(item => item.account === 'Cash' && item.type === 'Expense')
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const cardIncome = expenses
    .filter(item => item.account === 'Card' && item.type === 'Income')
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const cardExpense = expenses
    .filter(item => item.account === 'Card' && item.type === 'Expense')
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const bankIncome = expenses
    .filter(item => item.account === 'Bank Accounts' && item.type === 'Income')
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const bankExpense = expenses
    .filter(item => item.account === 'Bank Accounts' && item.type === 'Expense')
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  // --- Calculate initial bank balance ---
  const initialBankBalance = bankIncome - bankExpense;

  // --- Adjust bank balance if Cash or Card only have expenses (no income) ---
  let adjustedBankBalance = initialBankBalance;
  if (cashIncome === 0 && cashExpense > 0) adjustedBankBalance -= cashExpense;
  if (cardIncome === 0 && cardExpense > 0) adjustedBankBalance -= cardExpense;

  // --- Calculate total income, expense, transfer, and totals ---
  const totalIncome = bankIncome + cashIncome + cardIncome;
  const totalExpense = bankExpense + cashExpense + cardExpense;
  const totalTransfer = expenses
    .filter(item => item.type === 'Transfer')
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  // --- Rendering ---
  return (
    <SafeAreaView>
      <View style={{backgroundColor: 'white', padding: 10}}>
        <Text style={{textAlign: 'center', fontSize: 15, fontWeight: '500'}}>
          Accounts
        </Text>
      </View>
      <View style={{borderColor: '#E0E0E0', borderWidth: 0.6}} />

      {/* Summary Section */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          justifyContent: 'space-around',
          backgroundColor: 'white',
        }}>
        <View>
          <Text
            style={{fontWeight: '500', color: '#004953', textAlign: 'center'}}>
            Assets
          </Text>
          <Text
            style={{
              marginTop: 3,
              textAlign: 'center',
              color: '#0578eb',
              fontSize: 13,
              fontWeight: '500',
            }}>
            Rs.{totalIncome.toFixed(2)}
          </Text>
        </View>

        <View>
          <Text
            style={{fontWeight: '500', color: '#004953', textAlign: 'center'}}>
            Liabilities
          </Text>
          <Text
            style={{
              marginTop: 3,
              textAlign: 'center',
              color: '#eb6105',
              fontSize: 13,
              fontWeight: '500',
            }}>
            Rs.{(totalExpense + totalTransfer).toFixed(2)}
          </Text>
        </View>

        <View>
          <Text style={{fontWeight: '500', textAlign: 'center'}}>Total</Text>
          <Text
            style={{
              marginTop: 3,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: '500',
            }}>
            Rs.{(totalIncome - (totalExpense + totalTransfer)).toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={{borderColor: '#E0E0E0', borderWidth: 0.6}} />

      {/* Account Details */}
      <View>
        {/* Cash */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: 'white',
          }}>
          <Text style={{fontWeight: '500'}}>Cash</Text>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: '#0578eb'}}>+ Rs.{cashIncome.toFixed(2)}</Text>
            <Text style={{color: '#eb6105'}}>
              - Rs.{cashExpense.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Card */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <Text style={{fontWeight: '500'}}>Card</Text>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: '#0578eb'}}>+ Rs.{cardIncome.toFixed(2)}</Text>
            <Text style={{color: '#eb6105'}}>
              - Rs.{cardExpense.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Bank Accounts */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: 'white',
          }}>
          <Text style={{fontWeight: '500'}}>Bank Accounts</Text>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: '#0578eb'}}>+ Rs.{bankIncome.toFixed(2)}</Text>
            <Text style={{color: '#eb6105'}}>
              - Rs.{bankExpense.toFixed(2)}
            </Text>
            <Text style={{marginTop: 3, color: '#004953', fontWeight: '600'}}>
              Net: Rs.{adjustedBankBalance.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({});
