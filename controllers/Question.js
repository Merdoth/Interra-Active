import models from '../models';
import pagination, { paginates } from '../utils/pagination';


// create reference database model
const Questions = models.questions;

let query = {};


/**
 * @class
 */
class Question {
    /**
     * @description add question controller
     *
     * @param { Object } req - Request object
     * @param { Object } res - Response object
     *
     * @returns { Object } json - payload
     */
    static addQuestion(req, res) {
      const { question } = req.body;
      Questions
        .create({
          userId: req.decoded.id,
          question
        })
        .then(createdQuestion =>
          res
            .status(200)
            .send({ 
              message: 'Your Question has been successfully added!',
              createdQuestion 
            }))
        .catch(error => res.status(500).send({ error }));
    }

    /**
   * @description get all questions controller
   *
   * @param { Object } req - Request object
   * @param { Object } res - Response object
   *
   * @returns { Object } json - payload
   */
  static getAllQuestions(req, res) {
    let { limit, offset, page } = req.query;
    page = page || 1;
    limit = limit || 6;
    offset = limit * (page - 1) || 0;
      query = {
        include: [{ model: answers }],
        order: [['createdAt', 'DESC']],
        offset,
        limit: 10
      };
      Questions
      .findAndCountAll(query)
      .then((questionsFound) => {
        if (questionsFound.length < 1) {
          return res.status(404).send({
            message: 'No questions found. Please try to ask one.'
          });
        }
        query.offset = req.query.offset || 0;
        query.limit = req.query.limit || 10;
        const paginate = pagination(
          query.limit,
          query.offset,
          questionsFound.count
        );
        if (questionsFound) {
          return res.status(200).send({
            messsage: 'Questions successfully found.',
            paginate,
            questionsFound
          });
        }
        return res.status(404).send({ message: 'Questions not found' });
      })
      .catch(error => res.status(500).send({ error }));
  }

}

export default Question;