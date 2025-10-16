import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';
import AntDesign from '@react-native-vector-icons/ant-design';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {BottomModal} from 'react-native-modals';
import {SlideAnimation, ModalContent} from 'react-native-modals';
import {ModalPortal} from 'react-native-modals';
const HomeScreen = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [option, setOption] = useState('Daily');
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectdMonth] = useState(moment());
  const date = currentDate.format('MMMM YYYY');
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const day =currentData?.item.date.format('DD');
  const monthYear = currentData?.item.date.format('MM YYYY');
  const dayName = currentData?.item.date.format('ddd');

  const setOpenModal = (item, dayExpenses,  totalIncome,totalExpense) => {
    setCurrentData({item, dayExpenses, totalIncome,totalExpense });

    setModalVisible(!modalVisible);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'month'));
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentDate]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/expenses', {
        params: {date},
      });
      setExpenses(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const groupedExpenses = expenses.reduce((acc, expense) => {
    const day = expense.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(expense);
    return acc;
  }, {});

  const totalIncome = expenses
    ?.filter(expense => expense.type == 'Income')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalExpense = expenses
    ?.filter(expense => expense.type == 'Expense')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [navigation]),
  );

  const screenWidth = Dimensions.get('window').width;
  const boxWidth = screenWidth / 7 - 8;

  const generateDaysForMonth = month => {
    const startOfMonth = month.clone().startOf('month');
    const endOfMonth = month.clone().endOf('month');

    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');

    const days = [];
    let date = startDate.clone();

    while (date.isBefore(endDate, 'day')) {
      days.push({
        date: date.clone(),
        isCurrentMonth: date.month() === selectedMonth.month(),
      });
      date.add(1, 'day');
    }
    return days;
  };

  const days = generateDaysForMonth(currentDate);
  const renderDay = ({item}) => {
    const isSunday = item?.date.day() === 0;
    const isSaturday = item?.date.day() === 6;

    const isToday = item?.date.isSame(moment(), 'day');

    const dayKey = item?.date.format('DD ddd').trim();

    const dayExpenses = groupedExpenses[dayKey] || [];

    const totalIncome = dayExpenses
      .filter(expense => expense.type == 'Income')
      .reduce((total, expense) => total + parseFloat(expense.amount), 0);

    const totalExpense = dayExpenses
      .filter(expense => expense.type == 'Expense')
      .reduce((total, expense) => total + parseFloat(expense.amount), 0);

    const totalSavings = totalIncome - totalExpense;
    return (
      <Pressable
        onPress={() =>
          setOpenModal(item, dayExpenses, totalIncome, totalExpense)
        }
        style={[
          {
            width: boxWidth,
            height: 80,
            margin: 4,
            borderRadius: 4,
            backgroundColor: 'white',
          },
          isToday && {backgroundColor: '#b6f0b8'},
          isSunday && {backgroundColor: '#ffe5e5'},
          isSaturday && {backgroundColor: '#e5f1ff'},
        ]}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            textAlign: 'center',
            color: isSunday ? '#db7843' : isSaturday ? '#4e91de' : 'black',
            marginLeft: 2,
          }}>
          {item?.date.date()}
        </Text>
        <View style={{marginTop: 'auto', marginBottom: 5}}>
          {totalIncome > 0 && (
            <Text
              style={{
                fontSize: 10,
                color: '#0578eb',
                textAlign: 'left',
                marginLeft: 2,
                fontWeight: '500',
              }}>
              {totalIncome.toFixed(2)}
            </Text>
          )}

          {totalExpense > 0 && (
            <Text
              style={{
                fontSize: 10,
                color: '#eb6105',
                textAlign: 'left',
                marginLeft: 2,
                fontWeight: '500',
              }}>
              {totalExpense.toFixed(2)}
            </Text>
          )}

          {totalSavings > 0 && (
            <Text
              style={{
                fontSize: 10,
                color: 'black',
                textAlign: 'left',
                marginLeft: 2,
                fontWeight: '500',
              }}>
              {totalSavings.toFixed(2)}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#F8F8F8'}}>
        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 2,
            padding: 3,
            backgroundColor: 'white',
          }}>
          <Ionicons name="search-outline" color={'black'} size={23} />
          <Text>Money Manager</Text>
          <Ionicons name="filter-outline" color={'black'} size={23} />
        </View>

        {/* MONTH SELECTOR */}
        <View
          style={{
            paddingTop: 15,
            marginHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
          <AntDesign
            name="left"
            size={15}
            color={'black'}
            onPress={handlePrevMonth}
          />
          <Text>{currentDate.format('MMM YYYY')}</Text>
          <AntDesign
            name="right"
            size={15}
            color={'black'}
            onPress={handleNextMonth}
          />
        </View>

        {/* OPTION BAR */}
        <View
          style={{
            paddingTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'space-around',
            margin: 1,
            backgroundColor: 'white',
            paddingBottom: 10,
            paddingHorizontal: 5,
          }}>
          {['Daily', 'Calendar'].map(
            opt => (
              <Pressable key={opt} onPress={() => setOption(opt)}>
                <Text
                  style={{
                    color: option === opt ? 'black' : 'gray',
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                  {opt}
                </Text>
              </Pressable>
            ),
          )}
        </View>

        {/* TOTALS SECTION */}
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 12,
              paddingBottom: 12,
              justifyContent: 'space-around',
              backgroundColor: 'white',
              marginHorizontal: 2,
            }}>
            <View>
              <Text
                style={{
                  fontWeight: '500',
                  color: '#004953',
                  textAlign: 'center',
                }}>
                Expense
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  textAlign: 'center',
                  color: '#eb6105',
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                Rs.{totalExpense.toFixed(2)}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontWeight: '500',
                  color: '#004953',
                  textAlign: 'center',
                }}>
                Income
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  textAlign: 'center',
                  color: '#0578eb',
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                Rs.{totalIncome.toFixed(2)}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontWeight: '500',
                  color: '#004953',
                  textAlign: 'center',
                }}>
                Total
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  textAlign: 'center',
                  color: '#eb6105',
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                Rs.{(totalIncome - totalExpense).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={{borderColor: '#E0E0E0', borderWidth: 0.6}} />

          {/* FIXED SCROLLVIEW */}
          {option === 'Daily' && (
            <ScrollView
              style={{flex: 1, backgroundColor: '#F8F8F8'}}
              contentContainerStyle={{
                paddingBottom: 100, // ⬅ adds space to allow full upward scroll
                paddingTop: 10,
              }}
              nestedScrollEnabled={true} // ⬅ enables inner scroll on Android
              showsVerticalScrollIndicator={true}>
              {Object.keys(groupedExpenses).map((day, index) => {
                const totalExpense = groupedExpenses[day]
                  .filter(expense => expense.type === 'Expense')
                  .reduce(
                    (sum, expense) => sum + parseFloat(expense.amount),
                    0,
                  );

                const totalIncome = groupedExpenses[day]
                  .filter(expense => expense.type === 'Income')
                  .reduce(
                    (sum, expense) => sum + parseFloat(expense.amount),
                    0,
                  );

                return (
                  <Pressable
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      padding: 12,
                      marginBottom: 10,
                    }}>
                    {/* Header */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginHorizontal: 1,
                          gap: 6,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          {day?.split(' ')[0]}
                        </Text>
                        <Text
                          style={{
                            backgroundColor: '#404040',
                            borderRadius: 4,
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                            color: 'white',
                            fontSize: 11,
                          }}>
                          {day?.split(' ')[1]}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 50,
                          marginHorizontal: 1,
                        }}>
                        <Text
                          style={{
                            color: '#0578eb',
                            fontWeight: '400',
                            fontSize: 15,
                          }}>
                          Rs.{totalIncome.toFixed(2)}
                        </Text>
                        <Text
                          style={{
                            color: '#eb6105',
                            fontWeight: '400',
                            fontSize: 15,
                          }}>
                          Rs.{totalExpense.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        borderColor: '#E0E0E0',
                        marginTop: 7,
                        borderWidth: 0.4,
                      }}
                    />

                    {groupedExpenses[day].map((item, idx) => (
                      <Pressable key={idx} style={{marginTop: 15}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 30,
                            marginHorizontal: 2,
                          }}>
                          <Text
                            style={{
                              fontSize: 13,
                              color: 'gray',
                              minWidth: 17,
                            }}>
                            {item?.category}
                          </Text>
                          <View>
                            <Text style={{fontSize: 14, color: 'gray'}}>
                              {item?.account}
                            </Text>

                            {item?.note && (
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: 'gray',
                                  marginTop: 2,
                                  width: 130,
                                }}>
                                {item?.note}
                              </Text>
                            )}
                          </View>

                          <Text
                            style={{
                              color:
                                item?.type === 'Expense'
                                  ? '#eb6105'
                                  : '#0578eb',
                            }}>
                            Rs.{Number(item.amount).toFixed(2)}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {option == 'Calendar' && (
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginBottom: 8,
                  backgroundColor: '#E0E0E0',
                  paddingVertical: 5,
                }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (item, index) => (
                    <Text
                      style={[
                        {
                          fontSize: 13,
                          fontWeight: '500',
                          textAlign: 'center',
                          width: boxWidth,
                          paddingBlock: 3,
                        },
                        item == 'Sun' && {color: 'orange'},
                        item == 'Sat' && {color: 'blue'},
                      ]}
                      key={index}>
                      {item}
                    </Text>
                  ),
                )}
              </View>
              <FlatList
                data={days}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderDay}
                numColumns={7}
                scrollEnabled={false}
              />
            </ScrollView>
          )}
        </View>
      </SafeAreaView>

      {/* ADD BUTTON */}
      <View
        style={{
          backgroundColor: '#FF7F50',
          width: 46,
          height: 46,
          borderRadius: 23,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: 15,
          bottom: 20,
        }}>
        <Pressable onPress={() => navigation.navigate('Create')}>
          <Ionicons name="add-outline" size={32} color={'white'} />
        </Pressable>
      </View>

      <BottomModal
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            SlideForm: 'bottom',
          })
        }
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
        onHardwareBackPress={() => setModalVisible(!modalVisible)}>
        <ModalContent style={{width: '100%', height: 250}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>{day}</Text>
                <View>
                  <Text style={{color: 'gray', fontSize: 9}}>{monthYear}</Text>
                  <Text
                    style={{
                      backgroundColor: '#404040',
                      borderRadius: 4,
                      paddingHorizontal: 4,
                      paddingVertical: 1,
                      color: '#000',
                      fontSize: 10,
                      alignSelf: 'flex-start',
                      marginTop: 3,
                      color:'white',
                    }}>{dayName}</Text>
                </View>
              </View>


             <View style={{flexDirection:'row', alignItems:"center", gap:20}}>
              <Text style={{color:"#0578eb", fontSize:15, fontWeight:"500"}}>
                Rs.{currentData?.totalIncome.toFixed(2)}
              </Text>
                 <Text style={{color:"#eb6105", fontSize:15, fontWeight:"500"}}>
                Rs.{currentData?.totalExpense.toFixed(2)}
              </Text>
             </View>

            </View>
          </View>

            

            {currentData?.dayExpenses.length > 0 ? (
              <View > 
              {currentData?.dayExpenses.map((item,index)=>(
                <View style={{marginTop:18}}>
                <View key={index} style={{flexDirection:'row', alignItems:"center", gap:30}}>

                  <Text style={{fontSize:13, color:"gray", minWidth:70}}>{item?.category}</Text>
                  <View style={{flex:1}}>
                    <Text style={{fontSize:14, color:'gray'}}> {item?.account} </Text>
                    {item?.note && (<Text tyle={{fontSize:14, color:'gray', marginTop:3}}>{item?.note}</Text>)}
                  </View>

                   <Text>{Number(item?.amount).toFixed(2)}</Text>

                </View>
                </View>
              ))}
              
               </View>
            ):(
              <View></View>
            )}


        </ModalContent>
      </BottomModal>
      <ModalPortal />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
