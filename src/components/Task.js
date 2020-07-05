import React from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import Icon from '@expo/vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import estiloComum from '../estiloComum'
import Swipeable from 'react-native-gesture-handler/Swipeable'
// import { Container } from './styles';

export default props => {

  let check = null 
  
  if(props.doneAt !== null){
    check = (
      <View style={styles.done}>
        <Icon  
           name="check"
           size={20}
           color={estiloComum.colors.secondary}  />
      </View>
    )
  }else {
    check = <View style={styles.pending}/>
  }


  const descStyle = props.doneAt !== null ? 
      {textDecorationLine: 'line-through'} : {} 


      const getRightContent = () => {
          return  (
            <TouchableOpacity style={styles.right} 
                onPress={() => props.onDelete && props.onDelete(props.id)}>
              <Icon name="trash" size={30} color='#FFF'/>
            </TouchableOpacity>
          )
      }


      const getLeftContent = () => {
        return  (
          <View style={styles.left}>
            <Icon name="trash" size={20} color='#FFF' style={styles.excludeIcon}/>
            <Text style={styles.excludeText}>Excluir</Text>
          </View>
        )
    }

      return (
      <Swipeable 
        renderLeftActions={getLeftContent}
        onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}
        renderRightActions={getRightContent}>  
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
            <View style={styles.checkContainer}>{check}</View>
          </TouchableWithoutFeedback>

          <View>
             <Text style={[styles.description, descStyle]}>{props.desc}</Text>
             <Text style={styles.date}>
               {moment(props.estimateAt).locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')}
             </Text>
          </View>
        </View>
        </Swipeable> 
      )
}

const styles = StyleSheet.create({
  container:{
    paddingVertical:10,
    flexDirection: 'row',
    borderBottomWidth:1,
    borderColor: '#AAA',
    backgroundColor:'#fff'
  },

  checkContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },

  pending:{
    borderWidth:1,
    height: 25,
    width: 25,
    borderRadius: 15,
    borderColor:'#555',
    
  },
  done:{
    height: 25,
    width:25,
    borderRadius:15,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },

  description:{
    // fontFamily
    color: estiloComum.colors.mainText,
    fontSize:15,
  },

  date:{
    // fontFamily
    color: estiloComum.colors.subText,
    fontSize:12,
  },
  right:{
    backgroundColor: 'red',
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'flex-end',
    paddingHorizontal:20
  },

  left:{
    flex:1,
    backgroundColor: 'red',
    flexDirection:'row',
    alignItems:'center',
  }, 
  excludeText:{
       // fontFamily ,
       color: '#fff',
       fontSize: 20,
       margin:10,  
  },
  excludeIcon:{
    marginLeft:10, 
  }
})