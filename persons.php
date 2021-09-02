<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once('database.php');

class Person
{
    public $database;

    public function __construct()
    {
        $this->database = new Database();
    }

    public function index()
    {
        return $this->database->select('person.*,sex.name as gender');
    }

    //Create person
    public function create()
    {
        return $this->database->create($_POST);

    }

    //Update person
    public function update()
    {
        return $this->database->update($_POST, $_GET['id']);
    }


    //Get person by id
    public function getById($id)
    {
        return $this->database->getById($id);
    }

    public function show()
    {

    }

    //Delete person
    public function delete($id)
    {
        return $this->database->delete($id);
    }
}

$person = new Person();
if ($_GET['type'] == 'index') {
    echo json_encode($person->index());
}
if ($_GET['type'] == 'create') {
    echo json_encode($person->create());
}
if ($_GET['type'] == 'getById') {
    echo json_encode($person->getById($_GET['id']));
}
if ($_GET['type'] == 'update') {
    echo json_encode($person->update());
}
if ($_GET['type'] == 'delete') {
    echo json_encode($person->delete($_GET['id']));
}

//?>