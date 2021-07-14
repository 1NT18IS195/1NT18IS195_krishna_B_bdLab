db.emp.aggregate([
    { $match: { EligibleForPayRaise: YES } },
    {
        $group: {
            _id: "$Name",
            EmpSalary: {
                $sum: {
                    $subtract: ["$Salary", "$Tax"],
                },
            },
        },
    },
    { $sort: { empSal: -1 } },
]);

// --------------------------------------------

let mapFun = function () {
    emit(this.Name, this.Salary);
};

let redFun = function (empName, empSalary) {
    return Array.sum(empSalary);
};

db.emp.mapReduce(mapFun, redFun, { out: "salarySum" });
db.salarySum.find().pretty();
// --------------------------------------------

// prettier-ignore
db.emp.find({
    $and: [
        { tax: { $gt: 9000 } }, 
        { EligibleForPayRaise: NO }
    ],
}).pretty();

// --------------------------------------------

db.emp.updateOne(
    { name: "Krishna" },
    {
        $set: { Salary: 56000 },
    }
);

db.emp.find({ name: "Krishna" }).pretty();

db.salarySum.drop();
db.salarySum.find({});

// --------------------------------------------
