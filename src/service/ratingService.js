import { connectToDB, getDB } from '../config/connectDB';

let db;
connectToDB((err) => {
    if (!err) {
        db = getDB();
    }
});

let getLessListExamRatings = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!keyword) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu keyword, vui lòng bổ sung',
                });
            } else {
                let exam = await db
                    .collection('exam')
                    .find({ 'data.title': { $regex: keyword, $options: 'i' }, 'data.typeExam': 'PUBLIC' })
                    .limit(4)
                    .toArray();

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailExamRatings = (examID) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!examID) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu examID, vui lòng bổ sung',
                });
            } else {
                let exam = await db.collection('ratings').findOne({ 'data.examID': examID });

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let filterExamRatings = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.examID) {
                resolve({ errCode: 1, message: 'Nhập thiếu id bài thi' });
            } else {
                let exam = await db
                    .collection('doExam')
                    .find({
                        $and: [
                            { 'data.examID': { $eq: data.examID } },

                            data.score
                                ? data.typeScore === 'greater'
                                    ? { 'data.maxScore': { $gte: +data.score } }
                                    : { 'data.maxScore': { $lte: +data.score } }
                                : {},
                            data.currentJoin
                                ? data.typeCurrentJoin === 'greater'
                                    ? { 'data.quantityJoin': { $gte: +data.currentJoin } }
                                    : { 'data.quantityJoin': { $lte: +data.currentJoin } }
                                : {},
                            data.time
                                ? data.typeTime === 'greater'
                                    ? { 'data.valueTimeDoExam': { $gte: +data.time * 60 } }
                                    : { 'data.valueTimeDoExam': { $lte: +data.time * 60 } }
                                : {},
                            data.dayStart
                                ? {
                                      'data.dateDoExam': { $gte: data.dayStart },
                                  }
                                : {},
                        ],
                    })
                    .sort(
                        data.typeRatings === 'less'
                            ? { ['data.maxScore']: -1, ['data.valueTimeDoExam']: 1, ['data.quantityJoin']: 1 }
                            : { ['data.maxScore']: 1, ['data.valueTimeDoExam']: -1, ['data.quantityJoin']: -1 },
                    )
                    .toArray();

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllDoExamRatings = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu email, vui lòng bổ sung',
                });
            } else {
                let ratings = await db.collection('ratings').find({ 'users.email': email }).toArray();

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: ratings,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let sortMyRatingsByType = (request) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!request.userID || !request.typeSort) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu, vui lòng bổ sung`,
                });
            } else {
                let typeSort = request.typeSort === 'up' ? 1 : -1;

                let exam = await db
                    .collection('ratings')
                    .find({ 'users.userID': request.userID })
                    .sort({ ['users.' + request.type]: typeSort })
                    .toArray();

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getLessListExamRatings,
    getDetailExamRatings,
    filterExamRatings,
    getAllDoExamRatings,
    sortMyRatingsByType,
};
