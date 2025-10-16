import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import AntDesign from '@react-native-vector-icons/ant-design';
import {TabBar, TabView} from 'react-native-tab-view';

import axios from 'axios'
import { PieChart } from 'react-native-gifted-charts';



const StatsScreen = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [index, setIndex] = useState(0);
  const [option, setOption] = useState('Stats');
  const [expenses, setExpenses] = useState([]);
const [routes, setRoutes] = useState([{
  key:"edit",
  title:"Income",

},
{
  key:"view",
  title:"Expense"
}
])

const date = currentDate.format('MMMM YYYY')
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

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'month'));
  };


  const renderScene = ({route})=>{
  switch(route.key){
    case'edit':
    return <Income />

    case 'view':
      return <Expense />
  }
}


const RenderPieChartExpense = () => {
  if (!expenses || expenses.length === 0) {
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Text style={{color: 'grey'}}>No expense data available</Text>
      </View>
    );
  }

  // Filter only expense data
  const expenseData = expenses.filter(item => item.type === 'Expense');

  // Calculate total expense amount
  const total = expenseData.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // Generate random color for each category and format data for chart
  const pieData = expenseData.map(item => ({
    value: Number(item.amount),
    color: getRandomColor(),
    text: `${Math.round((item.amount / total) * 100)}%`,
    category: item.category,
  }));

  return (
    <View style={{alignItems: 'center', marginVertical: 20}}>
      {/* Donut Chart */}
      <PieChart
        data={pieData}
        donut               // make it a donut
        innerRadius={40}    // smaller inner hole
        radius={90}         // slightly smaller overall
        showText
        textColor="white"
        textSize={12}
        showValuesAsLabels
        focusOnPress
      />

      {/* Legend */}
      <View style={{marginTop: 20, width: '85%'}}>
        {pieData.map((slice, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: slice.color,
                  marginRight: 10,
                }}
              />
              <Text style={{fontSize: 15, color: 'black'}}>
                {slice.category} ({slice.value.toFixed(0)})
              </Text>
            </View>
            <Text style={{fontWeight: '600'}}>
              {((slice.value / total) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};



const RenderPieChartIncome = () => {
  if (!expenses || expenses.length === 0) {
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Text style={{color: 'grey'}}>No expense data available</Text>
      </View>
    );
  }

  // Filter only expense data
  const incomeData = expenses.filter(item => item.type === 'Income');

  // Calculate total expense amount
  const total = incomeData.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // Generate random color for each category and format data for chart
  const pieData = incomeData.map(item => ({
    value: Number(item.amount),
    color: getRandomColor(),
    text: `${Math.round((item.amount / total) * 100)}%`,
    category: item.category,
  }));

  return (
    <View style={{alignItems: 'center', marginVertical: 20}}>
      {/* Donut Chart */}
      <PieChart
        data={pieData}
        donut               // make it a donut
        innerRadius={40}    // smaller inner hole
        radius={90}         // slightly smaller overall
        showText
        textColor="white"
        textSize={12}
        showValuesAsLabels
        focusOnPress
      />

      {/* Legend */}
      <View style={{marginTop: 20, width: '85%'}}>
        {pieData.map((slice, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: slice.color,
                  marginRight: 10,
                }}
              />
              <Text style={{fontSize: 15, color: 'black'}}>
                {slice.category} ({slice.value.toFixed(0)})
              </Text>
            </View>
            <Text style={{fontWeight: '600'}}>
              {((slice.value / total) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};


// Helper function to generate random colors
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};






   const Income = ()=>{
    return(
  <View style={{backgroundColor:"white", }}>
    <View>
      {option == "Budget" && (
        <View>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:12}}>
          <View>
            <Text style={{color:"grey", fontSize:15}}>Remaining (Monthly)</Text>
            <Text style={{fontSize:19, marginTop:8, fontWeight:"500", letterSpacing:0.5}}>Rs.1000.00</Text>
          </View>
             <View style={{padding:10, backgroundColor:'#E0E0E0', borderRadius:8, alignSelf:'flex-start'}}>
              <Text>Budget Setting</Text>
             </View>
          </View>

          {expenses?.filter((item) => item.type == "Income").map((item,index)=> (
            <Pressable key={index} style={{borderTopColor:"#E0E0E0", borderTopWidth:0.6, padding:14, backgroundColor:"white"}}>
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontWeight:"500"}}>
                  {item?.category}
                </Text>
                 <Text style={{textAlign:"right"}}>
                  {Number(item?.amount).toFixed(2)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )} 

      {option == 'Stats' && (
      <View>
        <RenderPieChartIncome />
      </View>
      )}

      
    </View>
  </View>
    )
}

const Expense = ()=>{
  return(
   <View style={{backgroundColor:"white", }}>
    <View>
      {option == "Budget" && (
        <View>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:12}}>
          <View>
            <Text style={{color:"grey", fontSize:15}}>Remaining (Monthly)</Text>
            <Text style={{fontSize:19, marginTop:8, fontWeight:"500", letterSpacing:0.5}}>Rs.1000.00</Text>
          </View>
             <View style={{padding:10, backgroundColor:'#E0E0E0', borderRadius:8, alignSelf:'flex-start'}}>
              <Text>Budget Setting</Text>
             </View>
          </View>

          {expenses?.filter((item) => item.type == "Expense").map((item,index)=> (
            <Pressable key={index} style={{borderTopColor:"#E0E0E0", borderTopWidth:0.6, padding:14, backgroundColor:"white"}}>
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Text style={{fontWeight:"500"}}>
                  {item?.category}
                </Text>
                 <Text style={{textAlign:"right"}}>
                  {Number(item?.amount).toFixed(2)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )} 



       {option == 'Stats' && (
      <View>
        <RenderPieChartExpense />
      </View>

     )}


    </View>
  </View>
    )
  
}


  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 12}}>
        <View
          style={{
            backgroundColor: '#E0E0E0',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            borderRadius: 12,
          }}>
          <Pressable
            onPress={() => setOption('Stats')}
            style={{
              backgroundColor: option == 'Stats' ? 'white' : '#E0E0E0',
              padding: 12,
              borderRadius: 12,
              flex: 1,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Stats' ? 'orange' : '#606060',
              }}>
              Stats
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setOption('Budget')}
            style={{
              backgroundColor: option == 'Budget' ? 'white' : '#E0E0E0',
              padding: 12,
              borderRadius: 12,
              flex: 1,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Budget' ? 'orange' : '#606060',
              }}>
              Budget
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setOption('Note')}
            style={{
              backgroundColor: option == 'Note' ? 'white' : '#E0E0E0',
              padding: 12,
              borderRadius: 12,
              flex: 1,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Note' ? 'orange' : '#606060',
              }}>
              Note
            </Text>
          </Pressable>
        </View>
      </View>
      {option == 'Budget' && (
    
        <View
          style={{
            paddingTop: 15,
            marginHorizontal: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingBottom: 10,
            paddingHorizontal: 10,
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
     
      
      )}



         <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: '100%'}}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'black'}}
            style={{backgroundColor: 'white'}}
            labelStyle={{fontWeight:"bold"}}
            activeColor='black'
            inactiveColor='grey' 
            />
        )}
      />



    </SafeAreaView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({});
