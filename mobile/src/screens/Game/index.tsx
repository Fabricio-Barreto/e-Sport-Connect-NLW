import { FlatList, Image, SafeAreaView, TouchableOpacity, View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'
import { Background } from '../../components/Background';
import { Entypo } from '@expo/vector-icons'
import logoImg from '../../assets/logo-nlw-esports.png'
import { styles } from './styles';
import { GameParams } from '../../@types/navigation';
import { THEME } from '../../theme';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { useEffect, useState } from 'react';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {
 const [duos, setDuos] = useState<DuoCardProps[]>([]);
 const [discordDuoSelected, setDiscordDuoSelected] = useState('');

  const route = useRoute();
  const game = route.params as GameParams;
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function getDiscordUser (adsId: string) {
    fetch(`http://192.168.0.9:3333/ads/${adsId}/discord`)
    .then(res => res.json())
    .then(data => setDiscordDuoSelected(data.discord))
  }
  
  useEffect(() => {
    fetch(`http://192.168.0.9:3333/games/${game.id}/ads`)
    .then(res => res.json())
    .then(data => setDuos(data))
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo name="chevron-thin-left" color={THEME.COLORS.CAPTION_300} size={20}/>
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo}/>

          <View style={styles.right} />

        </View>

        <Image
          source={{ uri: game.bannerUrl}}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading 
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        />

        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id)}/>
          )} 
          horizontal
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
          showsVerticalScrollIndicator={false}
          style={styles.containerList}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              N??o h?? an??ncios publicados para esse jogo.
            </Text>
          )}
        />
        
        <DuoMatch 
          visible={discordDuoSelected.length > 0}
          discord= {discordDuoSelected}
          onClose={() => setDiscordDuoSelected('')} 
        />
      </SafeAreaView>
    </Background>
  );
}