import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{paddingTop:Platform.OS == 'android' ? 15 : 0, flex:1, backgroundColor:"white"}}>
     <ScrollView>
      <View style={{padding:12, flexDirection:"column", gap:15}}>
        <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='calculator-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
            Calculator Box
          </Text>
        </View>

          <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='laptop-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
            PC Manager
          </Text>
        </View>

          <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='help-circle-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
            Help
          </Text>
        </View>

          <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='document-text-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
            Feedback
          </Text>
        </View>

          <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='heart-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
            Rated
          </Text>
        </View>
      </View>


      <View style={{padding:12, backgroundColor:"#E0E0E0", marginVertical:10}}>
        <Text style={{color:"#282828"}}>Category/Account</Text>
      </View>
       <View style={{padding:12, flexDirection:"column", gap:15}}>

       <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='cash-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
            Income Category Setting
          </Text>
        </View>

          <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='checkbox-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
               Expense Category Setting
          </Text>
        </View>

          <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='person-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
            Account setting
          </Text>
        </View>

          <View style={{flexDirection:"row", alignItems:"center", gap:10, marginHorizontal:2}}>
          <Ionicons name='settings-outline' size={24} color='#282828'/>
          <Text style={{fontSize:15}}> 
            Budget setting
          </Text>
        </View>
             </View>
         


     </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})