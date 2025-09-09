from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from recommender.utils import users


class UserTypeSelectionForm(forms.Form):
    USER_TYPE_CHOICES = [
        ('customer', 'Customer'),
        ('business', 'Business'),
    ]
    user_type = forms.ChoiceField(
        choices=USER_TYPE_CHOICES,
        widget=forms.RadioSelect,
        required=True
    )

class CustomerRegisterForm(forms.Form):
    username = forms.CharField(max_length=150, required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)
    password_confirm = forms.CharField(widget=forms.PasswordInput, label='Confirm Password', required=True)

    def clean_username(self):
        username = self.cleaned_data['username']
        if users.find_one({'username': username}):
            raise forms.ValidationError('Username already exists')
        return username

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError('Passwords do not match')
        return cleaned_data

class BusinessRegisterForm(forms.Form):
    business_name = forms.CharField(max_length=255, required=True)
    email = forms.EmailField(required=True)
    hq_address = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}), required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)
    password_confirm = forms.CharField(widget=forms.PasswordInput, label='Confirm Password', required=True)

    def clean_business_name(self):
        business_name = self.cleaned_data['business_name']
        if users.find_one({'business_name': business_name}):
            raise forms.ValidationError('Business name already exists')
        return business_name

    def clean_email(self):
        email = self.cleaned_data['email']
        if users.find_one({'email': email}):
            raise forms.ValidationError('Email already exists')
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError('Passwords do not match')
        return cleaned_data