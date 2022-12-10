/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const dataset = [
  {word: 'SIMPLE'},
  {word: 'SMOKE'},
  {word: 'WINGS'},
  {word: 'WORTH'},
  {word: 'FORGET'},
  {word: 'LOCATION'},
  {word: 'BETTER'},
  {word: 'FRESH'},
  {word: 'SEASON'},
  {word: 'NIGHT'}
]

function Points ({ points }) {
  return (
      <div className="col">
        <h2 className="display-4">
          Points <br />
          {points}
        </h2>
      </div>
  )
}

function Strikes ({ strikes }) {
  return (
      <div className="col">
        <h2 className="display-4 text-end">
          Strikes <br />
          {strikes}
        </h2>
      </div>
  )
}

function Word (word) {
  //console.log(this.shuffle(word))
  //const shuffledWord = this.shuffle(word)

  //const currentWord = [word]

  console.log(word.word.word)
  const shuffledWord = shuffle(word.word.word)


  console.log(shuffledWord)

  return (
    <div className="row mb-5">
      <div className="col">
    <h1 className="display-1 text-center">{shuffledWord}</h1>
    </div>
    </div>
    )
}

function Response ({ message }) {
  const className = `alert alert-info ${message ? 'visible' : 'invisible'}`
  
  return (
    <div className="row mb-5">
      <div className="col">
        <div className={className}>{message || '&nbsp;' }</div>
      </div>
    </div>
  )
}

function Form ({ onGuess }) {
  
  const [guess, setGuess] = React.useState('') 

  function changeHandler (e) {
    setGuess(e.target.value)
  }

  function submitHandler (e) {
    e.preventDefault()
    console.log(guess)
    onGuess(guess)
    setGuess('')
  }

  return (
    <div className="row mb-5">
      <div className="col-6 offset-3">
        <form className="form" onSubmit={submitHandler}>
          <input type="text" className="form-control text-uppercase" value={guess} onChange={changeHandler} />
        </form>
      </div>
    </div>
  )
}

function Button ({ passes, text, variant, onButtonClick }) {
  const className = `btn btn-${variant}`

  function clickHandler () {
    onButtonClick()
  }

  return (
    <div className="row">
      <div className="col d-flex justify-content-center">
        <button type="button" className={className} onClick={clickHandler} >{passes} {text}</button>
      </div>
    </div>
  )
}

function App () {

  const [words, setWords] = useLocalStorage('words', dataset)
  const [word, setWord] = useLocalStorage('word', words[0])
  const [points, setPoints] = useLocalStorage('points', 0)
  const [strikes, setStrikes] = useLocalStorage('strikes', 0)
  const [message, setMessage] = useLocalStorage('message', '')
  const [passes, setPasses] = useLocalStorage('passes', 3)
  const [active, setActive] = useLocalStorage('active', true)


  function useLocalStorage (key, defaultValue) {

    const ls = JSON.parse(localStorage.getItem('scramble'))

    return React.useState(ls ? ls[key] : defaultValue)
  }

  function onGuessHandler (guess) {
    if ( word.word === guess.toUpperCase() ) {
      setWords((prevState) => prevState.slice(1))
    if (words.length >1) {
      setPoints((prevState) => prevState + 1)
      setMessage('Correct. Next Word.')
      } else {
      setMessage(`No more words left. Your final score is ${points}.`)
      gameOver()
      }
      
    } else {
      setStrikes((prevState) => prevState + 1)
      console.log('Incorrect')// update response
      setMessage('Incorrect. Try Again.')
      if (strikes === 2){
        setMessage(`Maximum Number of Strikes Reached. Your Final Score is ${points} Try Again?`)
        gameOver()
      }
    }
  }

  function onPassHandler () {

    setPasses(passes-1)

    setWords((prevState) => prevState.slice(1))
    setMessage('Pass. Next Word.')
    console.log(passes)
    if(!passes){
      setMessage('No More passes Left')
    }
  }

  function gameOver () {
    setActive(false)
  }

  function onPlayHandler () {
    setMessage('')
    setActive(true)
    setPoints(0)
    setStrikes(0)
    setPasses(3)
    setWords(dataset)
  }

  // fixes the setWord side effect
  React.useEffect(() => {
    setWord(words[0])
  }, [words.length] )

  React.useEffect(() => {
    localStorage.setItem('scramble', JSON.stringify({
      active, // active: active(can be stored without a key)
      points,
      strikes,
      words,
      word,
      passes,
      message
    }))
  })

  return (
    <div className="container p-5">
      
    <div className="row mb-5">
      <Points points={points} />
      <Strikes strikes={strikes} />
      </div>
      {active && <Word word={word} />}
      <Response message={message} />
      {active && <Form onGuess={onGuessHandler}/>}
      {(active && passes) ? <Button passes={passes} text="Passes Remaining" variant="danger" onButtonClick={onPassHandler}/>: ''}
      {!active && <Button text="Play Again?" variant="primary" onButtonClick={onPlayHandler} />}
    </div>
  )

}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)