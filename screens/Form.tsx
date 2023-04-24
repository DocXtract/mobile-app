import { StyleSheet, Alert, View, TouchableOpacity, SafeAreaView, Text } from 'react-native'
import { Camera, CameraType, FlashMode } from 'expo-camera'
import CameraPreview from '../components/CameraPreview'
import Button from '../components/Button'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

interface cameraStatus {
    status: string
}

export default function Form({ switchScreens, updatePhoto, forum }: any) {
    const [cameraStarted, setCameraStarted] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState<any>([])
    const [imageIndex, setImageIndex] = useState(0)
    const [type, setType] = useState(CameraType.back);
    const [flash, setFlash] = useState(FlashMode.off)
    const cameraRef: any = useRef(null);
    const [flashMode, setFlashMode] = useState(FlashMode.off)
    const [pages, setPages] = useState(1)
    console.log(pages)
    useEffect(() => {
        axios.get(`http://169.226.236.211:8000/getForm/${forum.index}`, {
            data: undefined
        },).then(res => {
            console.log(res.data)
            setPages(res.data.pages)
        })
    }, [])
    const handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode(FlashMode.off)
        } else if (flashMode === 'off') {
            setFlashMode(FlashMode.on)
        } else {
            setFlashMode(FlashMode.auto)
        }

    }
    const takePicture = async () => {
        if (cameraRef) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                console.log(photo)
                let update = [...capturedImage]
                update[imageIndex] = photo
                setCapturedImage(update)
                updatePhoto(update)
                setPreviewVisible(true)
            } catch (e) {
                console.log(e)
            }
        }
    }

    const startCamera = async () => {
        //   MediaLibrary.requestPermissionsAsync();
        const cameraStatus: cameraStatus = await Camera.requestCameraPermissionsAsync();
        if (cameraStatus.status === "granted") setCameraStarted(true)
        else Alert.alert("Access denied")
    }

    const closeCamera = () => {
        setCameraStarted(false)
    }

    const fillForm = () => {
        switchScreens('Fill Form')
    }

    const handleNext = () => {
        setImageIndex(imageIndex + 1)
        setPreviewVisible(false)
    }
    return (
        <SafeAreaView className='bg-slate-200 flex-1'>
            {cameraStarted ?
                previewVisible && capturedImage ? (
                    <CameraPreview photo={capturedImage[imageIndex]} lastPage={imageIndex === pages - 1} handleNext={handleNext} switchScreens={switchScreens} cancel={() => {
                        setPreviewVisible(false)
                        delete capturedImage[imageIndex]
                    }} />
                ) : (
                    <Camera style={styles.camera} type={type} flashMode={flashMode} ref={cameraRef}>
                        <TouchableOpacity onPress={handleFlashMode}
                            style={{
                                position: 'absolute',
                                right: '5%',
                                top: '10%',
                                backgroundColor: flashMode === FlashMode.off ? '#000' : '#fff',
                                borderRadius: 50,
                                height: 25,
                                width: 25
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20
                                }}
                            >
                                ⚡️
                            </Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                position: 'absolute',
                                top: -20,
                                flexDirection: 'row-reverse',
                                flex: 1,
                                width: '100%',
                                marginTop: 30,
                                justifyContent: 'space-between'
                            }}><Button icon='cross' onPress={closeCamera} color="#fff" />
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                flexDirection: 'row',
                                flex: 1,
                                width: '100%',
                                padding: 20,
                                justifyContent: 'space-between'
                            }}>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    flex: 1,
                                    alignItems: 'center'
                                }}>
                                <TouchableOpacity
                                    onPress={takePicture}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        bottom: 0,
                                        borderRadius: 50,
                                        backgroundColor: '#fff'
                                    }} />
                            </View>
                        </View>
                    </Camera>
                )
                : (
                    <SafeAreaView>
                        <View className='p-absolute flex-row m-5'>
                            <Button title='Go to Dashboard' icon='back' onPress={() => switchScreens('Dashboard')} color="#000" />
                        </View>
                        <View className='flex-column items-center'>
                            <Text className='text-2xl font-bold my-2'>{forum?.name}</Text>
                            <Text className='text-md font-semibold'>{forum?.organizer}</Text>
                        </View>
                        <View className='mt-[100] items-center'>
                            <View className='border-2 rounded-lg w-[200]'>
                                <Button title='Print Document' icon='print' onPress={startCamera} color="#000" />
                            </View>
                            <View className='border-2 rounded-lg w-[200] mt-10'>
                                <Button title='Scan Document' icon='camera' onPress={startCamera} color="#000" />
                            </View>
                            <View className='border-2 rounded-lg w-[200] mt-10'>
                                <Button title='Fill Manually' icon='edit' onPress={fillForm} color="#000" />
                            </View>
                        </View>
                    </SafeAreaView>
                )
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    camera: {
        flex: 1,
        width: '100%',
    }
})