<?php
header('Access-Control-Allow-Origin: *');

class Database
{
    public $servername = "localhost";
    public $username = "root";
    public $password = "Commit-m1998";
    public $dbname = "td_task";
    public $conn;

    public function __construct()
    {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }


    public function select($fields = '*')
    {
        $stmt = $this->conn->prepare("SELECT $fields from person JOIN sex on person.sex_id=sex.id");
        $stmt->execute();

        if (!$stmt->error) {
            $result = $stmt->get_result();
            $arr = [];
            while ($row = $result->fetch_assoc()) {
                $arr[] = $row;
            }
            return $arr;
        }
    }

    public function create($data)
    {

        $sex = $this->conn->prepare("SELECT * from sex where name=?");
        $sex->bind_param("s", $data['gender']);
        $sex->execute();

        $result = $sex->get_result();
        $gender = $result->fetch_assoc();

        if ($gender && $data['name'] && $data['surname'] && $data['age']) {

            $stmt = $this->conn->prepare("INSERT INTO person (name,surname,age,sex_id) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $data['name'], $data['surname'], $data['age'], $gender['id']);
            $stmt->execute();

            if (!$stmt->error) {
                return "New records created successfully";
            } else {
                http_response_code(422);
                return "New record does not created";
            }

        } else {
            http_response_code(422);
            return "Invalid data";
        }
    }

    public function getById($id)
    {

        $stmt = $this->conn->prepare("SELECT person.*,sex.name as gender from person JOIN sex on person.sex_id=sex.id where person.id=?");
        $stmt->bind_param("s", $id);
        $stmt->execute();

        if (!$stmt->error) {
            $result = $stmt->get_result();
            return $result->fetch_assoc();
        }
    }


    public function update($data, $id)
    {
        $sex = $this->conn->prepare("SELECT * from sex where name=?");
        $sex->bind_param("s", $data['gender']);
        $sex->execute();

        $result = $sex->get_result();;
        $gender = $result->fetch_assoc();
        if ($gender && $data['name'] && $data['surname'] && $data['age']) {
            $stmt = $this->conn->prepare("UPDATE person SET name=?,surname=?,age=?,sex_id=? WHERE id=?");
            $stmt->bind_param("sssss", $data['name'], $data['surname'], $data['age'], $gender['id'], $id);
            $stmt->execute();

            if (!$stmt->error) {
                return "Record successfully updated";
            } else {
                http_response_code(422);
                return "Record is not updated";
            }
        } else {
            http_response_code(422);
            return "Invalid data";
        }
    }

    public function delete($id)
    {
        if ($id) {
            $stmt = $this->conn->prepare("DELETE FROM person WHERE id=?");
            $stmt->bind_param("s", $id);
            $stmt->execute();

            if (!$stmt->error) {
                return "Record successfully deleted";
            } else {
                http_response_code(422);
                return "Record is not deleted";
            }
        } else {
            http_response_code(422);
            return "Invalid data";
        }
    }

}

?>