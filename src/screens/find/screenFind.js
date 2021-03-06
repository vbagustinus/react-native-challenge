import React  from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Spinner, Left, View, Input, Item, List, ListItem, Body, Right, Thumbnail, Card, CardItem } from 'native-base';
import Axios from 'axios'
import { FlatList, Image, StyleSheet } from "react-native";
import Modal from 'react-native-modal'
import {connect} from 'react-redux'
import {findCompare, getSpecs} from '../../actions'

import {
  TouchableOpacity
} from 'react-native'
const styles = StyleSheet.create({ 
  headline: { 
    fontSize: 15,
    alignSelf: 'center',
    color: 'green' 
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 2,
    justifyContent: 'center',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: 500,
    borderRadius: 30,
    padding: 0,
  },
}); 
export class Find extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: '',
      result: [],
      isModalVisible: false,
      specification: '',
      image: '',
      loading : false
    }
  }
  _showModal = (specs) => {
    console.log('INI SPECS', specs)
    this.props.getSpecs(specs)
    this.setState({
      image: specs.product_image,
      isModalVisible: true
    })
  }

  _hideModal = () => this.setState({ isModalVisible: false })

  _renderModalContent = () => {
    if(this.props.specification) {
      return (
        <View style={styles.modalContent}>
          <Button 
            transparent 
            textStyle={{color: '#fff'}}
            onPress={() => this._hideModal()}
            >
            <Icon name="close-circle" />
          </Button>
          <Image
            style={{
              alignSelf: 'center',
              width: 200,
              height:250,
              borderRadius:5,
            }}
            source={{uri: this.state.image}}
            resizeMode="cover"/>
          <FlatList
            data={this.props.specification.main_specs}
            keyExtractor={(item, i) => i}
            renderItem={({ item }) => (
              <Text style={styles.headline}>{item}</Text>
            )}
          />
        </View>
      )
      this.setState({
        loading: false
      })
      
    } else {
      this.setState({
        loading: true
      })
      return (
        <Spinner color='red' />
      )
    }
  };
  reset = () => {
    this.setState({
      brand: '',
      result: []
    })
  }
  compare = () => {
    this.props.findCompare(this.state.brand)
    this.setState({
      brand: '',
      loading: true
    })
  }
  render() {
    status = ''
    if(this.state.loading && this.props.compare.length === 0){
      status = <Spinner/>
    } else {
      status = <List>
                <FlatList
                  data={this.props.compare}
                  keyExtractor = { item => item.product_id}
                  renderItem = { ({item}) => (
                    <View>
                      <Thumbnail 
                        square 
                        size={80} 
                        source={{ uri: item.product_image }} />
                      <Body>
                        <Text>{item.product_title}</Text>
                        <Text note>Harga: Rp.{item.product_lowest_price * 211}, rating: {item.product_rating}</Text>
                      </Body>
                      <Right>
                        <TouchableOpacity
                          onPress={ () => this._showModal({ product_id: item.product_id, product_image: item.product_image }) }
                        >
                          <Text>Specs</Text>
                        </TouchableOpacity>
                      </Right>
                    </View>
                    )
                  } />
              </List>
    }
    return (
      <Container style = {{marginTop:23}}>
        <Content>
          <Item regular>
            <Input 
              style={{
                alignSelf: 'center',
                width: 250,
                height:40,
                borderRadius:5,
                marginBottom: 10,
                borderColor: 'green',
                borderWidth: 1
              }}
              name='brand' 
              value={this.state.brand} 
              onChangeText={(brand) => this.setState({brand})} 
              placeholder='Insert brand mobile' />
          </Item>
          <Button 
            style={{
              padding: 10,
              height: 40,
              width: 100
            }}
            block
            iconRight
            success
            onPress = { ()=> this.compare()}
            >
            <Text>Find</Text>
            <Icon name='search' />
          </Button>

          <Button 
            style={{
              padding: 10,
              height: 40,
              width: 100
            }}
            block
            iconRight
            light
            onPress = { ()=> this.reset()}
            >
            <Text>Clear</Text>
            <Icon name='backspace' />
          </Button>
          {status}  
        </Content>
        <Modal
            backdropOpacity={1}
            backdropColor={'#CED0CE'}
            animationIn={'zoomInDown'}
            animationOut={'zoomOutUp'}
            animationInTiming={1000}
            animationOutTiming={1000} 
            isVisible={this.state.isModalVisible}>
            {this._renderModalContent()}
        </Modal>
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    compare: state.reducerFind.compare,
    specification: state.reducerFind.specification
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    findCompare: (input) => dispatch(findCompare(input)),
    getSpecs: (input) => dispatch(getSpecs(input))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Find)