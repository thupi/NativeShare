/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren} from 'react';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Share as RNShare,
  Platform,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleNativeShare = () => {
    RNShare.share({
      title: 'Share File',
      url: 'http://www.africau.edu/images/default/sample.pdf',
    });
  };

  const handleShare = (fileUrl: string, type: string) => {
    if (Platform.OS === 'ios') {
      let filePath: string;
      const configOptions = {
        fileCache: true,
        path:
          RNFetchBlob.fs.dirs.DocumentDir +
          (type === 'application/pdf'
            ? '/SomeFileName.pdf'
            : '/SomeFileName.png'), // no difference when using jpeg / jpg / png /
      };
      RNFetchBlob.config(configOptions)
        .fetch('GET', fileUrl)
        .then(async resp => {
          console.log('Fetched');
          filePath = resp.path();
          let options = {
            type: type,
            url: filePath, // (Platform.OS === 'android' ? 'file://' + filePath)
          };
          await Share.open(options);
          // remove the image or pdf from device's storage
          await RNFetchBlob.fs.unlink(filePath);
        })
        .catch(error => {
          console.log('Failed', error);
        });
    } else {
      let filePath: string;
      const configOptions = {fileCache: true};
      RNFetchBlob.config(configOptions)
        .fetch('GET', fileUrl)
        .then(resp => {
          filePath = resp.path();
          return resp.readFile('base64');
        })
        .then(async base64Data => {
          base64Data = `data:${type};base64,` + base64Data;
          await Share.open({url: base64Data});
          // remove the image or pdf from device's storage
          await RNFetchBlob.fs.unlink(filePath);
        });
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="RN Share" onPress={handleNativeShare}></Button>
          <Button
            title="Share"
            onPress={() =>
              handleShare(
                'http://www.africau.edu/images/default/sample.pdf',
                'application/pdf',
              )
            }></Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
