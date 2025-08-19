from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse
import logging
from users.models import Patient
from modules.models import Modules, ClinicModules, PatientModules
from clinics.models import Clinic

logger = logging.getLogger(__name__)


@api_view(['POST'])
def add_module(request):
    """
    Add a module to the clinic
    """
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff:
        return JsonResponse({'detail': 'You do not have permission to add modules.'}, status=403)
    
    module_name = request.data.get('module_name')
    module_description = request.data.get('module_description', '')
    if not module_name:
        return JsonResponse({'detail': 'Module name is required.'}, status=400)
    
    try:
        module, created = Modules.objects.get_or_create(module_name=module_name , module_description=module_description)
        if created:
            return JsonResponse({'detail': f'Module "{module_name}" added successfully.'}, status=201)
        else:
            return JsonResponse({'detail': f'Module "{module_name}" already exists.'}, status=200)

    except Exception as e:
        logger.error(f"Error adding module: {e}")
        return JsonResponse({'detail': 'An error occurred while adding the module.'}, status=500)
    
@api_view(['PUT'])
def update_module(request, module_id):
    """
    Update an existing module.
    """
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff:
        return JsonResponse({'detail': 'You do not have permission to update modules.'}, status=403)

    module_name = request.data.get('module_name')
    module_description = request.data.get('module_description', '')

    if not module_name:
        return JsonResponse({'detail': 'Module name is required.'}, status=400)

    try:
        module = Modules.objects.get(id=module_id)
        module.module_name = module_name
        module.module_description = module_description
        module.save()
        return JsonResponse({'detail': f'Module "{module_name}" updated successfully.'}, status=200)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error updating module: {e}")
        return JsonResponse({'detail': 'An error occurred while updating the module.'}, status=500)

    
@api_view(['DELETE'])
def delete_module(request, module_id):
    """
    Delete a module from the clinic
    """
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff:
        return JsonResponse({'detail': 'You do not have permission to delete modules.'}, status=403)

    try:
        module = Modules.objects.get(id=module_id)
        # Check if the module is associated with any clinics
        if ClinicModules.objects.filter(module=module).exists():
            return JsonResponse({'detail': 'Module cannot be deleted as it is associated with clinics.'}, status=400)
        module.delete()
        return JsonResponse({'detail': f'Module "{module.module_name}" deleted successfully.'}, status=204)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error deleting module: {e}")
        return JsonResponse({'detail': 'An error occurred while deleting the module.'}, status=500)

@api_view(['POST'])
def add_clinic_module(request, clinic_id , module_id):
    '''
    adding clinic module
    '''
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff or not request.user.role == 'CLINIC_MANAGER':
        return JsonResponse({'detail': 'You do not have permission to add clinic modules.'}, status=403)

    try:
        clinic = Clinic.objects.get(id=clinic_id)
        module = Modules.objects.get(id=module_id)
        ClinicModules.objects.create(clinic=clinic, module=module)
        return JsonResponse({'detail': 'Clinic module added successfully.'}, status=201)
    except Clinic.DoesNotExist:
        return JsonResponse({'detail': 'Clinic not found.'}, status=404)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error adding clinic module: {e}")
        return JsonResponse({'detail': 'An error occurred while adding the clinic module.'}, status=500)

@api_view(['DELETE'])
def delete_clinic_module(request, clinic_id, module_id):
    '''
    Deleting clinic module
    '''
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff or not request.user.role == 'CLINIC_MANAGER':
        return JsonResponse({'detail': 'You do not have permission to delete clinic modules.'}, status=403)

    try:
        clinic = Clinic.objects.get(id=clinic_id)
        module = Modules.objects.get(id=module_id)
        clinic_module = ClinicModules.objects.get(clinic=clinic, module=module)
        clinic_module.delete()
        return JsonResponse({'detail': 'Clinic module deleted successfully.'}, status=204)
    except Clinic.DoesNotExist:
        return JsonResponse({'detail': 'Clinic not found.'}, status=404)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except ClinicModules.DoesNotExist:
        return JsonResponse({'detail': 'Clinic module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error deleting clinic module: {e}")
        return JsonResponse({'detail': 'An error occurred while deleting the clinic module.'}, status=500)

@api_view(['POST'])
def add_patient_module(request, clinic_id, patient_id, module_id):
    '''
    adding patient module
    '''
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff or not request.user.role == 'DOCTOR':
        return JsonResponse({'detail': 'You do not have permission to add patient modules.'}, status=403)

    try:
        patient = Patient.objects.get(id=patient_id)
        clinic = Clinic.objects.get(id=clinic_id)
        module = Modules.objects.get(id=module_id)
        if not ClinicModules.objects.filter(clinic=clinic, module=module).exists():
            return JsonResponse({'detail': 'Clinic module does not exist.'}, status=400)

        if not PatientModules.objects.filter(patient=patient, clinic=clinic, module=module).exists():
            PatientModules.objects.create(patient=patient, clinic=clinic, module=module)
            return JsonResponse({'detail': 'Patient module added successfully.'}, status=201)
        else:
            return JsonResponse({'detail': 'Patient module already exists.'}, status=400)
    except Patient.DoesNotExist:
        return JsonResponse({'detail': 'Patient not found.'}, status=404)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error adding patient module: {e}")
        return JsonResponse({'detail': 'An error occurred while adding the patient module.'}, status=500)

@api_view(['DELETE'])
def delete_patient_module(request, clinic_id, patient_id, module_id):
    '''
    Deleting patient module
    '''
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff or not request.user.role == 'DOCTOR':
        return JsonResponse({'detail': 'You do not have permission to delete patient modules.'}, status=403)

    try:
        patient = Patient.objects.get(id=patient_id)
        clinic = Clinic.objects.get(id=clinic_id)
        module = Modules.objects.get(id=module_id)
        if not ClinicModules.objects.filter(clinic=clinic, module=module).exists():
            return JsonResponse({'detail': 'Clinic module does not exist.'}, status=400)
        patient_module = PatientModules.objects.get(patient=patient, clinic=clinic, module=module)
        patient_module.delete()
        return JsonResponse({'detail': 'Patient module deleted successfully.'}, status=204)
    except Patient.DoesNotExist:
        return JsonResponse({'detail': 'Patient not found.'}, status=404)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except PatientModules.DoesNotExist:
        return JsonResponse({'detail': 'Patient module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error deleting patient module: {e}")
        return JsonResponse({'detail': 'An error occurred while deleting the patient module.'}, status=500)

@api_view(['POST'])
def toggle_clinic_module_active(request, clinic_id, module_id):
    '''
    Toggle clinic module active status
    '''
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff:
        return JsonResponse({'detail': 'You do not have permission to toggle clinic modules.'}, status=403)

    try:
        clinic = Clinic.objects.get(id=clinic_id)
        module = Modules.objects.get(id=module_id)
        if not ClinicModules.objects.filter(clinic=clinic, module=module).exists():
            return JsonResponse({'detail': 'Clinic module does not exist.'}, status=400)

        clinic_module = ClinicModules.objects.get(clinic=clinic, module=module)
        clinic_module.is_active = not clinic_module.is_active
        clinic_module.save()
        return JsonResponse({'detail': 'Clinic module active status toggled successfully.'}, status=200)
    except Clinic.DoesNotExist:
        return JsonResponse({'detail': 'Clinic not found.'}, status=404)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error toggling clinic module active status: {e}")
        return JsonResponse({'detail': 'An error occurred while toggling the clinic module active status.'}, status=500)

@api_view(['POST'])
def toggle_patient_module_active(request, clinic_id, patient_id, module_id):
    '''
    Toggle patient module active status
    '''
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff or not request.user.role == 'DOCTOR':
        return JsonResponse({'detail': 'You do not have permission to toggle patient modules.'}, status=403)

    try:
        patient = Patient.objects.get(id=patient_id)
        clinic = Clinic.objects.get(id=clinic_id)
        module = Modules.objects.get(id=module_id)
        if not PatientModules.objects.filter(patient=patient, clinic=clinic, module=module).exists():
            return JsonResponse({'detail': 'Patient module does not exist.'}, status=400)

        patient_module = PatientModules.objects.get(patient=patient, clinic=clinic, module=module)
        patient_module.is_active = not patient_module.is_active
        patient_module.save()
        return JsonResponse({'detail': 'Patient module active status toggled successfully.'}, status=200)
    except Patient.DoesNotExist:
        return JsonResponse({'detail': 'Patient not found.'}, status=404)
    except Clinic.DoesNotExist:
        return JsonResponse({'detail': 'Clinic not found.'}, status=404)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error toggling patient module active status: {e}")
        return JsonResponse({'detail': 'An error occurred while toggling the patient module active status.'}, status=500)
