import * as React from 'react'
import {Button, Text, TextInput, View} from 'react-native'
import {render, screen, fireEvent} from '@testing-library/react-native'

function usernameTest() {
  const [name, setUser] = React.useState('')
  const [show, setShow] = React.useState(false)

  return (
    <View>
      <TextInput value={name} onChangeText={setUser} testID="input" />
      <Button
        title="Print Username"
        onPress={() => {
          setTimeout(() => {
            setShow(true)
          }, Math.floor(Math.random() * 200))
        }}
      />
      {show && <Text testID="printed-username">{name}</Text>}
    </View>
  )
}

test('examples of some things', async () => {
  const expectedUsername = 'Ada Lovelace'

  render(<usernameTest />)

  fireEvent.changeText(screen.getByTestId('input'), expectedUsername)
  fireEvent.press(screen.getByText('Print Username'))

  const usernameOutput = await screen.findByTestId('printed-username')

  expect(usernameOutput).toHaveTextContent(expectedUsername)

  expect(screen.toJSON()).toMatchSnapshot()
})