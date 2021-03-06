import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';
import '../styles/question.scss';
import { useRoom } from '../hooks/useRoom';


type RoomParms = {
  id: string;
}

export function AdminRoom(){
  //const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParms>();
  const roomId = params.id;
  const { title, questions} = useRoom(roomId);

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    history.push('/')
  }

  async function handleCheckQuestionAsAnswer(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighLightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm("Tem certeza que você deseja excluir esta perguntar?")){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    };
  }

  return(
    <div id="page-room">
      <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask"/>
            <div>
              <RoomCode code={roomId}/>
              <Button 
              isOutline
              onClick={handleEndRoom}>Encerrar Sala</Button>
            </div>
          </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 &&<span>{questions.length} perguntas(s)</span> }
        </div>

        <div className="question-list">
          {questions.map(question => {
          return (
            <Question
            key={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered  && (
                  <>
                    <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswer(question.id)}
                    >
                    <img src={checkImg} alt="Marcar perguntar como respondida" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighLightQuestion(question.id)}
                    >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                <img src={deleteImg} alt="Remover pergunta" />
                </button>
            </Question>
            
          );
          })}
        </div>
      </main>
    </div>
  );
}