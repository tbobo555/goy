package file

import (
    "testing"
    "strings"
    "os"
)

func TestFile_IsExist(t *testing.T) {
    err := initFile()
    if err != nil {
        t.Fatalf("Test File.IsExist failed, can't create i/o file for test")
    }
    h := File{}
    result := h.IsExist("file_for_unit_test.file")
    if result != true {
        t.Errorf("Test File.IsExist failed, with input file_for_unit_test.file, get false")
    }
    result = h.IsExist("not_exist.file")
    if result != false {
        t.Errorf("Test File.IsExist failed, with invalid input not_exist.file, get not false")
    }
    result = h.IsExist("!@#$%^&*()_><?:'~")
    if result != false {
        t.Errorf("Test File.IsExist failed, with invalid input !@#$%^&*()_><?:'~, get not false")
    }
    result = h.IsExist(string([]byte{123, 65, 78, 90}))
    if result != false {
        t.Errorf("Test File.IsExist failed, with invalid input string([]byte{123, 65, 78, 90}) get not false")
    }
    result = h.IsExist("/home/sss")
    if result != false {
        t.Errorf("Test File.IsExist failed, with invalid input /home/sss, get not false")
    }
}

func TestFile_ReadFile(t *testing.T) {
    err := resetTestFile()
    if err != nil {
        t.Fatalf("Test File.ReadFile failed , can't reset the test file")
    }
    expect := `this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
`
    h := File{}
    text, err := h.ReadFile("file_for_unit_test.file")
    if err != nil {
        t.Errorf("Test File.ReadFile failed, read file_for_unit_test.file, get an error: %s", err.Error())
    }
    if strings.Compare(string(text), expect) != 0 {
        t.Errorf("Test File.ReadFile failed, no get expect output")
    }
}

func TestFile_CoverFile(t *testing.T) {
    err := cleanTestFile()
    if err != nil {
        t.Fatalf("Test File.CoverFile failed, can't clean the test file, get error: %s", err)
    }
    input := `test text!
text text2`
    input2 := "123"
    expect := `123
`
    h := File{}
    h.CoverFile("file_for_unit_test.file", input, true)
    h.CoverFile("file_for_unit_test.file", input2, true)
    content, err := h.ReadFile("file_for_unit_test.file")
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in first test, error: %s", err.Error())
    }
    if strings.Compare(string(content), expect) != 0 {
        t.Errorf("Test File.WriteFile failed in first test, no get expect output")
    }
}

func TestFile_WriteFile(t *testing.T) {
    //------------first test
    input := `test text!
text text2`
    expect := `test text!
text text2
`
    err := cleanTestFile()
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in first test, can't clean the test file, get error: %s", err)
    }
    h := File{}
    err = h.WriteFile("file_for_unit_test.file", input)
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in first test, error: %s", err.Error())
    }
    content, err := h.ReadFile("file_for_unit_test.file")
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in first test, error: %s", err.Error())
    }
    if strings.Compare(string(content), expect) != 0 {
        t.Errorf("Test File.WriteFile failed in first test, no get expect output")
    }
    
    //------------second test
    expect = `test text!
text text2
another line test
`
    err = h.WriteFile("file_for_unit_test.file", `another line test`)
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in second test, error: %s", err.Error())
    }
    content, err = h.ReadFile("file_for_unit_test.file")
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in second test, error: %s", err.Error())
    }
    if strings.Compare(string(content), expect) != 0 {
        t.Errorf("Test File.WriteFile failed in second test, no get expect output")
    }
    
    //------------third test
    expect = `test text!
text text2
another line test
another line test
`
    file, err := os.OpenFile("file_for_unit_test.file", os.O_APPEND|os.O_WRONLY, 0644)
    defer file.Close()
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in third test, error: %s", err.Error())
    }
    err = h.WriteFile("file_for_unit_test.file", `another line test`)
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in third test, error: %s", err.Error())
    }
    content, err = h.ReadFile("file_for_unit_test.file")
    if err != nil {
        t.Fatalf("Test File.WriteFile failed in third test, error: %s", err.Error())
    }
    if strings.Compare(string(content), expect) != 0 {
        t.Errorf("Test File.WriteFile failed in third test, no get expect output")
    }
}

func TestFile_CreateFile(t *testing.T) {
    h := File{}
    err := h.CreateFile("file_for_unit_test.file")
    if err != nil {
        t.Errorf("Test File.CreateFile failed, error: %s", err.Error())
    }
    if h.IsExist("file_for_unit_test.file") != true {
        t.Errorf("Test File.CreateFile failed, already call create file, but file still not exist")
    }
}

func TestFile_DeleteFile(t *testing.T) {
    h := File{}
    err := h.DeleteFile("file_for_unit_test.file")
    if err != nil {
        t.Errorf("Test File.DeleteFile failed, error: %s", err.Error())
    }
    if h.IsExist("file_for_unit_test.file") == true {
        t.Errorf("Test File.DeleteFile failed, already call delete file, but file still exist")
    }
}

func initFile() error {
    h := File{}
    err := h.CreateFile("file_for_unit_test.file")
    if err != nil {
        return err
    }
    return nil
}

func cleanTestFile() error {
    h := File{}
    h.DeleteFile("file_for_unit_test.file")
    err := h.CreateFile("file_for_unit_test.file")
    if err != nil {
        return err
    }
    return nil
}

func resetTestFile() error {
    h := File{}
    err := cleanTestFile()
    if err != nil {
        return err
    }
    err = h.WriteFile("file_for_unit_test.file", `this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!
this is some info to read!`)
    if err != nil {
        return err
    }
    return nil
}
