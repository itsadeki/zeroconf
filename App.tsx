import React, {Fragment, useEffect, useState} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import Zeroconf from 'react-native-zeroconf';

const App = () => {
  const zeroconf = new Zeroconf();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [services, setServices] = useState<string | null>(null);
  useEffect(() => {
    zeroconf.scan('http', 'tcp', 'local.');
    zeroconf.publishService('http', 'tcp', 'local.', 'test', 4322);

    const res = setInterval(() => {
      console.log('[res]', JSON.stringify(zeroconf.getServices()));
    }, 2000);

    zeroconf.on('start', () => {
      setIsScanning(true);
      console.log('[Start]');
    });

    zeroconf.on('stop', () => {
      setIsScanning(false);
    });

    zeroconf.on('found', (r: any) => {
      console.log('[found]', r);
      setIsScanning(false);
    });

    zeroconf.on('resolved', service => {
      setServices(JSON.stringify(service, null, 2));
      console.log('[Resolve]', service);
    });

    zeroconf.on('error', err => {
      setIsScanning(false);
      console.log('[Error]', err);
    });

    return () => clearInterval(res);
  }, []);

  useEffect(() => {}, [services, isScanning]);

  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text>========</Text>
        <Text>Scan: {isScanning ? 'en cours' : 'ended'}</Text>
        <Text>Result: {services ? `Scan: ${services}` : 'no result'}</Text>
        <Text>========</Text>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
