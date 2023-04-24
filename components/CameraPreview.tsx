import axios from "axios";
import { View, ImageBackground, TouchableOpacity, Text, Platform } from "react-native"
import Button from "./Button"

export default function CameraPreview({ photo, lastPage, handleNext, cancel, switchScreens }: any) {
  console.log(lastPage)
  const handleSubmit = () => {
    switchScreens('Scan Form')
    // const formData = new FormData()
    // const data: any = {
    //   uri: photo.uri,
    //   name: 'form.jpg',
    //   type: 'image/jpg'
    // }
    // formData.append('file', data);
    // axios.post('http://169.226.70.238:8000/test', formData).then((res) => console.log(res))
  }

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >

      <ImageBackground
        source={{ uri: photo.uri }}
        style={{
          flex: 1
        }}
      >
        <TouchableOpacity onPress={cancel} className='border-2 rounded-xl bg-red-500 py-3 px-6 ' style={{
          position: 'absolute',
          bottom: 50,
          left: 50,
        }}>
          <Text className="text-white">Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={lastPage ? handleSubmit : handleNext} className='border-2 rounded-xl bg-green-500 py-3 px-6 ' style={{
          position: 'absolute',
          bottom: 50,
          right: 50,
        }}>
          <Text className="text-white">{ lastPage ? 'Submit' : 'Next Page'}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}