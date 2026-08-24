package com.employeemanagement.service;

import com.employeemanagement.dao.DepartmentDao;
import com.employeemanagement.dao.EmployeeDao;
import com.employeemanagement.dao.RoleDao;
import com.employeemanagement.dto.EmployeeRequest;
import com.employeemanagement.dto.EmployeeResponse;
import com.employeemanagement.exception.DuplicateEmployeeException;
import com.employeemanagement.exception.EmployeeNotFoundException;
import com.employeemanagement.exception.InvalidEmployeeException;
import com.employeemanagement.model.Employee;
import com.employeemanagement.model.EmployeeStatus;
import com.employeemanagement.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for EmployeeServiceImpl covering the core CRUD paths and
 * the main validation/error scenarios described in the project spec:
 * creation, retrieval, update, deletion, not-found and duplicate checks.
 *
 * The DAO layer is mocked so these tests run without a real MySQL
 * database - they verify business logic in isolation.
 */
@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {

    @Mock
    private EmployeeDao employeeDao;
    @Mock
    private DepartmentDao departmentDao;
    @Mock
    private RoleDao roleDao;

    private EmployeeServiceImpl employeeService;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeServiceImpl(employeeDao, departmentDao, roleDao);
    }

    private EmployeeRequest sampleRequest() {
        EmployeeRequest request = new EmployeeRequest();
        request.setEmployeeCode("EMP-100");
        request.setFirstName("Asha");
        request.setLastName("Rao");
        request.setEmail("asha.rao@example.com");
        request.setPhone("9876543210");
        request.setSalary(new BigDecimal("65000.00"));
        request.setJoiningDate(LocalDate.of(2024, 1, 15));
        request.setDepartmentId(1);
        request.setRoleId(1);
        request.setStatus("ACTIVE");
        return request;
    }

    private Employee sampleEntity(int id) {
        Employee employee = new Employee();
        employee.setEmployeeId(id);
        employee.setEmployeeCode("EMP-100");
        employee.setFirstName("Asha");
        employee.setLastName("Rao");
        employee.setEmail("asha.rao@example.com");
        employee.setPhone("9876543210");
        employee.setSalary(new BigDecimal("65000.00"));
        employee.setJoiningDate(LocalDate.of(2024, 1, 15));
        employee.setDepartmentId(1);
        employee.setRoleId(1);
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setDepartmentName("Engineering");
        employee.setRoleName("Software Engineer");
        return employee;
    }

    @Test
    void createEmployee_savesAndReturnsEmployee_whenDataIsValid() {
        EmployeeRequest request = sampleRequest();
        when(departmentDao.existsById(1)).thenReturn(true);
        when(roleDao.existsById(1)).thenReturn(true);
        when(employeeDao.findByEmployeeCode("EMP-100")).thenReturn(Optional.empty());
        when(employeeDao.findByEmail("asha.rao@example.com")).thenReturn(Optional.empty());
        when(employeeDao.create(any(Employee.class))).thenReturn(sampleEntity(1));

        EmployeeResponse response = employeeService.createEmployee(request);

        assertThat(response.getEmployeeId()).isEqualTo(1);
        assertThat(response.getFullName()).isEqualTo("Asha Rao");
        verify(employeeDao, times(1)).create(any(Employee.class));
    }

    @Test
    void createEmployee_throwsDuplicateEmployeeException_whenEmployeeCodeAlreadyExists() {
        EmployeeRequest request = sampleRequest();
        when(departmentDao.existsById(1)).thenReturn(true);
        when(roleDao.existsById(1)).thenReturn(true);
        when(employeeDao.findByEmployeeCode("EMP-100")).thenReturn(Optional.of(sampleEntity(5)));

        assertThatThrownBy(() -> employeeService.createEmployee(request))
                .isInstanceOf(DuplicateEmployeeException.class)
                .hasMessageContaining("EMP-100");

        verify(employeeDao, never()).create(any());
    }

    @Test
    void createEmployee_throwsInvalidEmployeeException_whenDepartmentDoesNotExist() {
        EmployeeRequest request = sampleRequest();
        when(departmentDao.existsById(1)).thenReturn(false);

        assertThatThrownBy(() -> employeeService.createEmployee(request))
                .isInstanceOf(InvalidEmployeeException.class);

        verify(employeeDao, never()).create(any());
    }

    @Test
    void getEmployeeById_returnsEmployee_whenFound() {
        when(employeeDao.findById(1)).thenReturn(Optional.of(sampleEntity(1)));

        EmployeeResponse response = employeeService.getEmployeeById(1);

        assertThat(response.getEmployeeCode()).isEqualTo("EMP-100");
    }

    @Test
    void getEmployeeById_throwsEmployeeNotFoundException_whenMissing() {
        when(employeeDao.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getEmployeeById(99))
                .isInstanceOf(EmployeeNotFoundException.class);
    }

    @Test
    void getEmployees_returnsMappedList() {
        when(employeeDao.search(null, null, null, null, "employee_id", "desc"))
                .thenReturn(List.of(sampleEntity(1), sampleEntity(2)));

        List<EmployeeResponse> result = employeeService.getEmployees(
                null, null, null, null, "employee_id", "desc");

        assertThat(result).hasSize(2);
    }

    @Test
    void getEmployees_throwsInvalidEmployeeException_whenStatusFilterIsInvalid() {
        assertThatThrownBy(() -> employeeService.getEmployees(
                null, null, null, "NOT_A_STATUS", "employee_id", "desc"))
                .isInstanceOf(InvalidEmployeeException.class);
    }

    @Test
    void updateEmployee_updatesAndReturnsEmployee_whenDataIsValid() {
        EmployeeRequest request = sampleRequest();
        when(employeeDao.findById(1)).thenReturn(Optional.of(sampleEntity(1)));
        when(departmentDao.existsById(1)).thenReturn(true);
        when(roleDao.existsById(1)).thenReturn(true);
        when(employeeDao.existsByEmployeeCodeExcludingId("EMP-100", 1)).thenReturn(false);
        when(employeeDao.existsByEmailExcludingId("asha.rao@example.com", 1)).thenReturn(false);
        when(employeeDao.update(any(Employee.class))).thenReturn(sampleEntity(1));

        EmployeeResponse response = employeeService.updateEmployee(1, request);

        assertThat(response.getEmployeeId()).isEqualTo(1);
        verify(employeeDao).update(any(Employee.class));
    }

    @Test
    void updateEmployee_throwsEmployeeNotFoundException_whenEmployeeMissing() {
        when(employeeDao.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.updateEmployee(1, sampleRequest()))
                .isInstanceOf(EmployeeNotFoundException.class);
    }

    @Test
    void deleteEmployee_deletesSuccessfully_whenEmployeeExists() {
        when(employeeDao.findById(1)).thenReturn(Optional.of(sampleEntity(1)));
        when(employeeDao.deleteById(1)).thenReturn(true);

        employeeService.deleteEmployee(1);

        verify(employeeDao).deleteById(1);
    }

    @Test
    void deleteEmployee_throwsEmployeeNotFoundException_whenEmployeeMissing() {
        when(employeeDao.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.deleteEmployee(1))
                .isInstanceOf(EmployeeNotFoundException.class);

        verify(employeeDao, never()).deleteById(anyInt());
    }
}
